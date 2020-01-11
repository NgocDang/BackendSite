using System.Collections.Generic;
using BackendSite.Service.DAL;
using BackendSite.Service.Model;

namespace BackendSite.Service.BLL
{
    public class MarketingBLL
    {
        private readonly MarketingService marketingService;

        public MarketingBLL(MarketingService marketingService)
        {
            this.marketingService = marketingService;
        }

        public IEnumerable<PointLevelInfo> GetPointLevelInfos(int siteId, int currencyId) => marketingService.GetPointLevelInfos(siteId, currencyId);

        public bool AddPointLevel(PointLevelInfo pointLevelInfo)
        {
            return marketingService.AddPointLevelInfo(pointLevelInfo);
        }

        public bool EditPointLevel(PointLevelInfo pointLevelInfo)
        {
            return marketingService.EditPointLevelInfo(pointLevelInfo);
        }
    }
}