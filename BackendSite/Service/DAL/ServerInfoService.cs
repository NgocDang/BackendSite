﻿using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using System.Data;
using BackendSite.Service.Model;

namespace BackendSite.Service.DAL
{
    public class ServerInfoService
    {
        private readonly IConfiguration configuration;

        public ServerInfoService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public ServerInfo GetModel()
        {
            int siteId = 1;
            using (MySqlConnection conn = new MySqlConnection(configuration.GetConnectionString("ConnectionString")))
            {
                return conn.QueryFirstOrDefault<ServerInfo>("ServerInfo_Get", new { SiteId = siteId }, commandType: CommandType.StoredProcedure);
            }
        }

        public ServerInfo GetModelWithSiteId(int siteId)
        {
            using (MySqlConnection conn = new MySqlConnection(configuration.GetConnectionString("ConnectionString")))
            {
                return conn.QueryFirstOrDefault<ServerInfo>("ServerInfo_Get", new { SiteId = siteId }, commandType: CommandType.StoredProcedure);
            }
        }

        public IEnumerable<ServerInfo> GetAll()
        {
            using (MySqlConnection conn = new MySqlConnection(configuration.GetConnectionString("ConnectionString")))
            {
                return conn.Query<ServerInfo>("ServerInfoAll_Get", commandType: CommandType.StoredProcedure);
            }
        }
    }
}