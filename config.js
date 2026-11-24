'use strict';

/*
=============================================================================
                    SNOC OPERATIONS HUB - CONFIGURATION
=============================================================================
Edit approved URLs and notices here. Leave a URL as '' when it is not configured.
Do not store passwords, tokens, API keys or secrets in this file.
=============================================================================
*/

const SNOC_CONFIG = Object.freeze({

  // ========================================================================
  // OPERATIONAL NOTICES
  // ========================================================================
  // Available levels:
  //   critical     = RED
  //   attention    = AMBER
  //   normal       = GREEN
  //   information  = BLUE
  //
  // To show "No active notices configured", leave both sources empty.
  // Set noticesDocument to a published CSV URL. The CSV columns are:
  // title,message,level
  // Users can update the shared CSV without changing config.js.
  noticesDocument: 'notices.csv',
  notices: [],



  // ROTA AND ON-CALL
  // Add available names for each NESO on-call coverage dropdown here.
  onCallCoverage: {
    networks: ['Sheraz Dar', 'Rahmatullah shareef'],
    security: ['Akif Kazmi', 'Aime Armel Njanko Noume','Paul Smith'],
    oss: ['Lavender Atieno', 'Andy Armitage','Firoz Dasu','Mbaya Molowa'],
  },

  snocRota: 'https://vodafone.sharepoint.com/:u:/r/sites/VBTSMESNOC/Shared%20Documents/ROTA/MES%20NOC%20ROTA/Dashboard/MES_NOC_V1_Dashboard_24092026.html?d=w7bb90ffe750744dca5f45c64ad160a74&csf=1&web=1&e=IYWjjG',
  onCallRota: 'https://vodafone.sharepoint.com/:x:/r/sites/NESO_CNI/_layouts/15/Doc.aspx?sourcedoc=%7B6F2D9057-B266-45B4-AAB5-1B737E4EBE80%7D&file=NESO%20P3E%20Standby%20Rota%2025022026%20V1.0.xlsx&wdLOR=c66A80448-5130-4960-A6A1-44697181561F&fromShare=true&action=default&mobileredirect=true&wdExp=TEAMS-TREATMENT&web=1&isSPOFile=1&ovuser=68283f3b-8487-4c86-adb3-a5228f18b893%2Cmichael.gamston1%40vodafone.com&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNjAzMTIyMzAyMCIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D',
  managementRota: '',

  // CHANGE MANAGEMENT
  changeTracker: 'https://vodafone.sharepoint.com/:x:/r/sites/DedicatedChangeTrackers/_layouts/15/Doc.aspx?sourcedoc=%7B584DF4CD-76E5-4B61-A47D-2D35345D8D67%7D&file=NESO%20Dedicated%20Change%20Tracker.xlsx&fromShare=true&action=default&mobileredirect=true',
 

  // HANDOVER
  handover: '',
  updateHandover: 'https://vodafone.sharepoint.com/:x:/r/sites/VBTSMESNOC/Shared%20Documents/SNOC/Dashboard/Document/Handover.xlsx?d=waf6a2f1592ba4805afe853820e9ac7ab&csf=1&web=1&e=EBH9Sr',

  // SHERLOCK
  sherlock: 'https://teams.microsoft.com/l/app/?titleId=T_b1a6b83e-3da2-88fd-857f-115541409429',

  // NESO
  nesoRota: '',
  nesoCni: '',
  nesoEnterprise: '',
  nesoProcedures: '',
  customerOperationsManual: '',
  escalationInformation: '',
  networkDocumentation: '',
  usefulNesoLinks: '',
  nesoResources: '',

  // PROCEDURES AND DOCUMENTATION
  procedures: '',
  documentation: '',

  // OPERATIONAL SYSTEMS / QUICK LINKS
  remedy: 'https://fixedlineremedy.enterprise.vodafone.com/arsys/shared/login.jsp?/arsys/forms/vsqlremedy1.energis.corp.energis.com/EN%3AFrontscreen/Default+Admin+View_New/?cacheid=6d83b408',
  serviceNow: 'https://login.microsoftonline.com/a63c9e9e-b4db-442a-a94f-08718d788e8c/saml2?SAMLRequest=lVJdj9MwEPwrkd%2Bdr4YmsZpKoRWi0nFE18IDb5tk07Pk2MHr9ODfk3OL7njgEK%2FemZ3ZGW8IRpVOop7do37A7zOSC36MSpO4Tio2Wy0MkCShYUQSrhPH%2BtOdSMNYTNY40xnFgpoIrZNG74ymeUR7RHuRHX55uKvYo3MTiSjSSGah9CFdh1ybp7AzY6ThMsEZw96wYL9YkBqed70wlTlLHY6ys4bM4IxWUqOnwnrVlVgib7O%2B5VmWAocyG3hc5EnR50WBRRf5W1jwwdgO%2FakVG0ARsuCwr9jxfpcXQ9smbYFJ0ubDepVlA7RlCXncriAuF%2B6BGiCSF3yhEs140ORAu4qlcbrmScyT7BSX4l0isjzM8%2FIbC5pbSO%2Bl7qU%2Bv51oewWR%2BHg6Nbz5fDz5BRfZo71f0P8Z5le05INcdrPtxucgvHH7uua3PcHvbtn2X%2BKb6LXETXASz84P%2B8Yo2f0MaqXM084iuOUaZ2f0xYzg%2Fu4iCRP%2FIns%2BeKjAEaSq%2B94iEYu2N90%2FP%2FL2Fw%3D%3D&RelayState=d5ecfaafc33b4750856a37eb0501311e',
  stableNet: '',
  genesys: 'https://login.euw2.pure.cloud/?rid=aoAjisaQJI7jhPYyaagpMB5NOaNryYhW0jHB2P02l6I#/authenticate-adv/org/vodafoneuk',
  sharePoint: 'https://teams.microsoft.com/l/team/19%3A2vU0WUuhSLwrx26Z1C090n2tkI5Vq2o0EeJVq20ErLw1%40thread.tacv2/conversations?groupId=d204cf32-f26a-4d85-bebd-047fcc3adc5f&tenantId=68283f3b-8487-4c86-adb3-a5228f18b893',
  ciscoIq: 'https://iq.cisco.com/login/',
  equinix: 'https://portal.equinix.com/login/',
  dailyReports: 'https://teams.microsoft.com/l/channel/19%3A2vU0WUuhSLwrx26Z1C090n2tkI5Vq2o0EeJVq20ErLw1%40thread.tacv2/Processes%20-%20%20LWIs?groupId=d204cf32-f26a-4d85-bebd-047fcc3adc5f&tenantId=68283f3b-8487-4c86-adb3-a5228f18b893',

  // AILS SharePoint resource
  ails: '',

  // DEFAULT WIDGET VISIBILITY
  widgets: {
    notices: true,
    glance: true,
    rota: true,
    handover: true,
    oncall: true,
    changes: true,
    dailyReport: true,
    ails: true,
    sherlock: true,
    neso: true,
    checklist: true,
    procedures: true,
    quicklinks: true
  }
});
