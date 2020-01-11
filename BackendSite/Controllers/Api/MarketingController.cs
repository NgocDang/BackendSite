﻿using System.Collections.Generic;
using BackendSite.Service.BLL;
using BackendSite.Service.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendSite.Controllers.Api
{
    public class SiteIdModel
    {
        public int SiteId { get; set; }
    }

    public class PointLevelModel
    {
        public int SiteId { get; set; }

        public int CurrencyId { get; set; }
    }

    [Authorize(Roles = "Admin")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MarketingController : ControllerBase
    {
        private readonly SelLangBLL selLangBLL;
        private readonly ServerInfoBLL serverInfoBLL;
        private readonly MarketingBLL marketingBLL;

        public MarketingController(SelLangBLL selLangBLL, ServerInfoBLL serverInfoBLL, MarketingBLL marketingBLL)
        {
            this.selLangBLL = selLangBLL;
            this.serverInfoBLL = serverInfoBLL;
            this.marketingBLL = marketingBLL;
        }

        [HttpGet]
        public ApiResult<IEnumerable<ServerInfo>> GetAllSites()
        {
            var apiResult = new ApiResult<IEnumerable<ServerInfo>>();
            var serverInfos = serverInfoBLL.GetAllServerInfo();
            apiResult.Data = serverInfos;
            apiResult.ErrorCode = 0;
            return apiResult;
        }

        [HttpPost]
        public ApiResult<IEnumerable<int>> GetSiteCurrencyIds(SiteIdModel siteIdModel)
        {
            var apiResult = new ApiResult<IEnumerable<int>>();
            var serverInfo = serverInfoBLL.GetServerInfoWithSiteId(siteIdModel.SiteId);
            apiResult.Data = serverInfo.ICurrencyList;
            apiResult.ErrorCode = 0;
            return apiResult;
        }

        [HttpPost]
        public ApiResult<IEnumerable<PointLevelInfo>> GetPointLevelInfos(PointLevelModel pointLevelModel)
        {
            var apiResult = new ApiResult<IEnumerable<PointLevelInfo>>();
            var pointLevelInfos = marketingBLL.GetPointLevelInfos(pointLevelModel.SiteId, pointLevelModel.CurrencyId);
            apiResult.Data = pointLevelInfos;
            apiResult.ErrorCode = 0;
            return apiResult;
        }

        [HttpPost]
        public ApiResult AddPointLevelInfo(PointLevelInfo pointLevelInfo)
        {
            bool result = marketingBLL.AddPointLevel(pointLevelInfo);
            var apiResult = new ApiResult();
            if (result)
            {
                apiResult.ErrorCode = 0;
                apiResult.Message = selLangBLL.GetMsg("msg_Updatesuccessful");
            }
            else
            {
                apiResult.ErrorCode = 9;
                apiResult.Message = selLangBLL.GetMsg("msg_UpdateFailed");
            }
            return apiResult;
        }

        [HttpPost]
        public ApiResult EditPointLevelInfo(PointLevelInfo pointLevelInfo)
        {
            bool result = marketingBLL.EditPointLevel(pointLevelInfo);
            var apiResult = new ApiResult();
            if (result)
            {
                apiResult.ErrorCode = 0;
                apiResult.Message = selLangBLL.GetMsg("msg_Updatesuccessful");
            }
            else
            {
                apiResult.ErrorCode = 9;
                apiResult.Message = selLangBLL.GetMsg("msg_UpdateFailed");
            }
            return apiResult;
        }
    }
}