CREATE PROCEDURE `ServerInfoAll_Get`()
BEGIN
	# 20200109@Tyler (BackendSite): Get all ServerInfo
	SELECT 
		ServerInfo.SiteId, 
        ServerInfo.SiteName, 
        ServerInfo.LangList, 
        ServerInfo.CurrencyList, 
        ServerInfo.DefLang,
        ServerInfo.DefCurrency
	FROM
		ServerInfo;
END