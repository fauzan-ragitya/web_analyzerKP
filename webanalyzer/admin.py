from django.contrib import admin
from .models import Fingerprint , Link , Session
# Register your models here.

class FingerprintAdmin(admin.ModelAdmin):
    list_display = ('digital_fingerprint','browser','operating_system','mobile','language')
    
admin.site.register(Fingerprint, FingerprintAdmin)
admin.site.register(Link)
admin.site.register(Session)