from django.shortcuts import render , get_object_or_404
from .models import Fingerprint, Link, Session , Heatmap
from django.http import HttpRequest, HttpResponse
from django.utils import timezone
from django.views.generic import View 
import numpy as np
import pandas as pd
from sqlalchemy import create_engine


# Create your views here.
def visualize(request, heatmap_id):
    hm = get_object_or_404(Heatmap, pk=heatmap_id)
    hm_x = hm.x_axis
    hm_y = hm.y_axis
    return render(request, 'webanalyzer/indexHM.html', {'x_axis': hm_x, 'y_axis': hm_y})


def collect(request):
    if request.method == 'GET':
        return render(request, 'webanalyzer/index.html')
    elif request.method == 'POST':
        fingerprint = request.POST.get('fingerprint')
        # Get the url id for session table
        current_url = Link.objects.get(url=request.get_full_path())
        if request.POST.get('state') == 'in':
            browser = request.POST.get('browser')
            OS = request.POST.get('OS')
            isMobile = request.POST.get('mobile')
            language = request.POST.get('language')
            # timezone = request.POST.get('timezone')

            if isMobile == 'true':
                isMobile = True
            elif isMobile == 'false':
                isMobile = False

            # Check if the digital fingerprint already stored in database
            if not Fingerprint.objects.filter(digital_fingerprint=fingerprint, browser=browser, operating_system=OS, mobile=isMobile, language=language).exists():
                # Save digital fingerprint to database
                df = Fingerprint(digital_fingerprint=fingerprint, browser=browser,
                                 operating_system=OS, mobile=isMobile, language=language)
                df.save()
                # Get the fingerprint id for session table
                print("Fingerprint stored")
            else:
                df = Fingerprint.objects.get(digital_fingerprint=fingerprint)
                print("Fingerprint already stored")

            # Save data to session table in database
            this_session = Session(user=df, url=current_url)
            this_session.save()
        elif request.POST.get('state') == 'out':
            df = Fingerprint.objects.get(digital_fingerprint=fingerprint)
            sessions = Session.objects.filter(user=df, url=current_url)
            for this_session in sessions:
                if this_session.time_in == this_session.time_out:
                    this_session.save()
            hm_x = request.POST.getlist('heatmapX[]')
            hm_y = request.POST.getlist('heatmapY[]')
            print(hm_x, hm_y)
            hm = Heatmap(user=df, url=current_url, x_axis=hm_x, y_axis=hm_y)
            hm.save()

        # Return response
        return HttpResponse(status=200)

def pie_chart(request):
    labels = set()
    data = []
    queryset = Fingerprint.objects.all()
    for element in queryset:
        labels.add(element.browser)
    for element in labels:
        x = queryset.filter(browser=element).count()
        data.append(x)
    
    labels = list(labels)    
    return render(request , 'webanalyzer/visualize.html' , {
        "labels" : labels , 
        "data" : data,
    })

def database_to_df(nama):
    engine_string = "postgresql+psycopg2://postgres:password@localhost:5432/webanalyzer"
    engine = create_engine(engine_string)
    df = pd.read_sql_query('SELECT * FROM '+nama ,engine)

    return df

def session_average_analisis(request):
    print('mulai')
    ## Read to dataframe
    df_session = database_to_df('webanalyzer_session')
    df_link = database_to_df('webanalyzer_link')

    ## Processing data
    labels = []
    data = []

    # Get labels
    for x in df_link['url']:
        labels.append(x)
    
    # Get data


    df_session['diff'] = df_session['time_out'] - df_session['time_in']
    # df_session['diff'] = df_session['diff'].values.astype(np.int64)
    # # Data cleansing belum bisa kalo datetime
    # df_dropped = df_session[df_session['diff']]
    # mean = df_session.groupby('url_id').mean()
    # mean['diff'] = pd.to_timedelta(mean['diff'])
    # mean['diff'] = mean['diff'].apply(lambda x : x.total_seconds())
    df_session['diff'] = df_session['diff'].apply(lambda x: x.total_seconds())
    df_session = df_session[df_session['diff'] < 1800]
    mean = df_session.groupby('url_id').mean()
    for element in mean['diff']:
        data.append(element)
    
    print(labels)
    print(data)

    return render(request, 'webanalyzer/session_analisis.html',{
        "labels" : labels , 
        "data" : data ,
    })
