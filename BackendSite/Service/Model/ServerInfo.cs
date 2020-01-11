﻿using System.Collections.Generic;
using Newtonsoft.Json;

namespace BackendSite.Service.Model
{
    public class SiteLanguage
    {
        public string LangId { set; get; }
        public string Language { set; get; }
    }

    public class ServerInfo
    {
        public int SiteId { set; get; }
        public string SiteName { set; get; }
        public string LangList { set; get; }
        public string CurrencyList { set; get; }
        public string DefLang { set; get; }

        public IEnumerable<int> ICurrencyList
        {
            get
            {
                return JsonConvert.DeserializeObject<IEnumerable<int>>(CurrencyList);
            }
        }

        public IEnumerable<string> ILangList
        {
            get
            {
                return JsonConvert.DeserializeObject<IEnumerable<string>>(LangList);
            }
        }
    }
}