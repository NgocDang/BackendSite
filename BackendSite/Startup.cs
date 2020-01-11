using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BackendSite.Service.BLL;
using BackendSite.Service.DAL;
using BackendSite.Service.Library;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BackendSite
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMemoryCache();
            /*Library*/
            services.AddSingleton<Tools>();
            services.AddSingleton<Common>();
            services.AddSingleton<CourierAdapter>();

            /*DAL*/
            services.AddSingleton<ServerInfoService>();
            services.AddSingleton<PendingFundService>();
            services.AddSingleton<AdminService>();
            services.AddSingleton<DepositService>();
            services.AddSingleton<WithdrawalService>();
            services.AddSingleton<WalletService>();
            services.AddSingleton<BankDetailService>();
            services.AddSingleton<AdminUserService>();
            services.AddSingleton<MessageService>();
            services.AddSingleton<MenuService>();
            services.AddSingleton<CustInfoService>();
            services.AddSingleton<LocalBankService>();
            services.AddSingleton<MarketingService>();

            /*BLL*/
            services.AddSingleton<ServerInfoBLL>();
            services.AddSingleton<PendingFundBLL>();
            services.AddSingleton<AdminBLL>();
            services.AddSingleton<SelLangBLL>();
            services.AddSingleton<DepositBLL>();
            services.AddSingleton<WithdrawalBLL>();
            services.AddSingleton<BankDetailBLL>();
            services.AddSingleton<MessageBLL>();
            services.AddSingleton<AuthorizeBLL>();
            services.AddSingleton<CustInfoBLL>();
            services.AddSingleton<MarketingBLL>();

            services.AddControllersWithViews().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.IgnoreNullValues = true;
            });
            services.AddRazorPages(options =>
            {
                options.Conventions.ConfigureFilter(new IgnoreAntiforgeryTokenAttribute());
            });
            services.AddRazorPages().AddRazorRuntimeCompilation();

            services.AddHttpContextAccessor();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(option =>
            {
                //option.AccessDeniedPath
                option.LoginPath = "/Home/Signin";
                option.Cookie.Name = ".backend";
                option.ExpireTimeSpan = TimeSpan.FromMinutes(30);//�S���w�]14��
            });
            /*services.AddDataProtection().DisableAutomaticKeyGeneration();
            services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo("CookieKeys")).SetApplicationName("SharedCookieApp");*/
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}");
            });
        }
    }
}