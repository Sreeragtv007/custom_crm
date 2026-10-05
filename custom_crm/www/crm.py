import frappe
from crm.www.crm import get_context as crm_get_context

def get_context():
    return crm_get_context()
