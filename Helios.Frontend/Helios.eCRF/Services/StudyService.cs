using Helios.Common.DTO;
using Helios.Common.Enums;
using Helios.Common.Model;
using Helios.eCRF.Hubs;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using PuppeteerSharp.Media;
using PuppeteerSharp;
using RestSharp;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System.Text.RegularExpressions;
using HtmlAgilityPack;

namespace Helios.eCRF.Services
{
    public class StudyService : ApiBaseService, IStudyService
    {
        private readonly IHubContext<LiveDataHub> _liveDataHub;
        public StudyService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IHubContext<LiveDataHub> liveDataHub) : base(configuration, httpContextAccessor)
        {
            _liveDataHub = liveDataHub;
        }

        #region Study
        public async Task<RestResponse<List<StudyDTO>>> GetStudyList(bool isLock,Int64 tenantId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyList", Method.Get);
                req.AddParameter("isLock", isLock);
                req.AddParameter("tenantId", tenantId);
                var result = await client.ExecuteAsync<List<StudyDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<StudyDTO>> GetStudy(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudy", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<StudyDTO>(req);
                return result;
            }
        }

        public async Task<string?> GetTenantStudyLimit(Int64 tenantId)
        {
            using (var client = AuthServiceClient)
            {
                var req = new RestRequest("AdminUser/GetTenantStudyLimit", Method.Get);
                req.AddParameter("tenantId", tenantId);
                var result = await client.ExecuteAsync<string?>(req);
                return result.Data;
            }
        }

        private async Task<ApiResponse<dynamic>> SetStudy(StudyModel studyModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/StudySave", Method.Post);
                req.AddJsonBody(studyModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> StudySave(StudyModel studyModel)
        {
            if(studyModel.StudyId == 0)
            {
                string? studyLimit = await GetTenantStudyLimit(studyModel.TenantId);
                studyModel.StudyLimit = studyLimit;
            }
            return await SetStudy(studyModel);
        }

        public async Task<ApiResponse<dynamic>> StudyLockOrUnlock(StudyLockDTO studyLockDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/StudyLockOrUnlock", Method.Post);
                req.AddJsonBody(studyLockDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Site
        public async Task<RestResponse<List<SiteDTO>>> GetSiteList(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetSiteList", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<SiteDTO>>(req);
                return result;
            }
        }

        public async Task<RestResponse<SiteDTO>> GetSite(Int64 siteId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetSite", Method.Get);
                req.AddParameter("siteId", siteId);
                var result = await client.ExecuteAsync<SiteDTO>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SiteSaveOrUpdate(SiteModel siteModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SiteSaveOrUpdate", Method.Post);
                req.AddJsonBody(siteModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SiteDelete(SiteModel siteModel)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SiteDelete", Method.Post);
                req.AddJsonBody(siteModel);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Mail Template
        public async Task<RestResponse<List<EmailTemplateModel>>> GetEmailTemplateList(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetEmailTemplateList", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<EmailTemplateModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteEmailTemplate(BaseDTO emailTemplateDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteEmailTemplate", Method.Post);
                req.AddJsonBody(emailTemplateDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<EmailTemplateModel>> GetEmailTemplate(Int64 templateId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetEmailTemplate", Method.Get);
                req.AddParameter("templateId", templateId);
                var result = await client.ExecuteAsync<EmailTemplateModel>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<EmailTemplateTagModel>>> GetEmailTemplateTagList(Int64 tenantId, int templateType)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetEmailTemplateTagList", Method.Get);
                req.AddParameter("tenantId", tenantId);
                req.AddParameter("templateType", templateType);
                var result = await client.ExecuteAsync<List<EmailTemplateTagModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> AddEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/AddEmailTemplateTag", Method.Post);
                req.AddJsonBody(emailTemplateTagDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteEmailTemplateTag(EmailTemplateTagDTO emailTemplateTagDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteEmailTemplateTag", Method.Post);
                req.AddJsonBody(emailTemplateTagDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetEmailTemplate(EmailTemplateDTO emailTemplateDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetEmailTemplate", Method.Post);
                req.AddJsonBody(emailTemplateDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        #endregion

        #region Visit
        public async Task<RestResponse<List<VisitModel>>> GetVisits(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisits", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<VisitModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisits(VisitDTO visitDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisits", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(visitDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                if (result.Data.IsSuccess)
                {
                    var data = await GetVisits(StudyId);
                    await _liveDataHub.Clients.Group("Visit").SendAsync("LiveData", new Dictionary<string, object> { { "data", data }, { "message", Name} });
                }
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteVisits(VisitDTO visitDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteVisits", Method.Post);
                req.AddJsonBody(visitDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                if (result.Data.IsSuccess)
                {
                    var data = await GetVisits(StudyId);
                    await _liveDataHub.Clients.Group("Visit").SendAsync("LiveData", new Dictionary<string, object> { { "data", data }, { "message", Name } });
                }
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisitPageEPro(VisitDTO visitDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitPageEPro", Method.Post);
                req.AddJsonBody(visitDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<List<PermissionModel>>> GetVisitPagePermissionList(PermissionPage pageKey, Int64 studyId, Int64 id)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitPagePermissionList", Method.Get);
                req.AddParameter("pageKey", pageKey);
                req.AddParameter("studyId", studyId);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync<List<PermissionModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisitPagePermission(VisitPagePermissionDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitPagePermission", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetStudyModule(SetModuleDTO dto)
        {
            //if (dto.ModuleIds.Count > 0 && dto.PageId != 0)
            //{
                using (var client = CoreServiceClient)
                {
                    string moduleIdsString = string.Join(",", dto.ModuleIds);
                    var req = new RestRequest("CoreStudy/GetModuleCollective", Method.Get);
                    AddApiHeaders(req);
                    req.AddParameter("moduleIds", moduleIdsString);
                    req.AddParameter("pageId", dto.PageId);
                    var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                    return result.Data;
                }
                //var modules = await GetModuleList(dto);

                //if (modules.IsSuccessful && modules.Data.Count > 0)
                //{
                //    return await SetStudyModule(modules.Data);
                //}
            //}

            //return new ApiResponse<dynamic>
            //{
            //    IsSuccess = false,
            //    Message = "Unsuccessful"
            //};
        }

        public async Task<RestResponse<List<VisitModel>>> GetTransferData(Int64 demoStudyId, Int64 activeStudyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetTransferData", Method.Get);
                req.AddParameter("demoStudyId", demoStudyId);
                req.AddParameter("activeStudyId", activeStudyId);
                var result = await client.ExecuteAsync<List<VisitModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetTransferData(List<TransferDataDTO> dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetTransferData", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<StudyVisitRelationModel>> GetVisitRelation()
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitRelation", Method.Get);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<StudyVisitRelationModel>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SetVisitRelation(List<StudyVisitRelationDTO> dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitRelation", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        class ElementOption
        {
            public int id { get; set; }
            public string tagName { get; set; }
            public string tagValue { get; set; }
            public string tagNameInpCls { get; set; }
            public string tagValueInpCls { get; set; }
        }
        public static bool IsJson(string input)
        {
            input = input.Trim();
            return (input.StartsWith("{") && input.EndsWith("}")) ||
                   (input.StartsWith("[") && input.EndsWith("]"));
        }

        public async Task<ApiResponse<dynamic>> AddStudyVisitAnnotatedCrfVersion(AnnotatedVersionDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/AddStudyVisitAnnotatedCrfVersion", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<byte[]>> GetStudyVisitAnnotatedCrf(AnnotatedDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyVisitAnnotatedCrf", Method.Get);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<StudyVisitAnnotatedCrfModel>(req);

                if (result.IsSuccessful && result.Data != null)
                {
                    try
                    {
                        string today = DateTime.Now.ToString("dd.MM.yyyy");
                        string htmlContent = @"<!DOCTYPE html><html lang=""en""><head><meta charset=""UTF-8""><meta name=""viewport"" content=""width=device-width, initial-scale=1.0""><title>PDF Oluştur</title><style>
table {
    border: dashed #ccc;
    border-width: 0 1px 0 1px;
}
table td {
    border: dashed #ccc;
border-width: 1px 0 1px 0;
}
.page-break { 
    page-break-before: always; 
}
</style>
        </head>
        <body>
<p align=""center"" ><strong>Olgu rapor formu<br><br></strong></p>
<p align=""center"" >" + result.Data.StudyModel.Title + @"<br><br>"+ result.Data.StudyModel.Description+ @"<br><br>Protokol Kod: <span id=""protocolcode"">" + result.Data.StudyModel.ProtocolCode + @"</span><br>Versiyon: "+dto.IsVersion+"<br>Tarih: "+ today + @"</p>
<br><br><br><br><br><br><br><br>
<div align=""center""><table style=""border:none"" cellspacing=""0"" cellpadding=""0"" width=""100%""><tbody><tr><td style=""border:none;font-size:12px""><p><strong>Hazırlayan kişi:</strong></p></td></tr><tr><td width=""246"" colspan=""2""><p><strong style=""font-size:12px"">Ad-Soyad, Ünvan</strong></p></td><td width=""178""><p><strong style=""font-size:12px"">Tarih</strong></p></td><td width=""218""><p><strong style=""font-size:12px"">İmza</strong></p></td></tr></tbody></table></div>
<br><br><br><br>
<div align=""center"" style=""font-weight:bold""><table style=""border:none"" cellspacing=""0"" cellpadding=""0"" width=""100%""><tbody><tr><td style=""border:none; font-size:12px""><p><strong>Onaylayan kişi:</strong></p></td></tr><tr><td width=""246"" colspan=""2""><p><strong style=""font-size:12px"">Ad-Soyad, Ünvan</strong></p></td><td width=""178""><p><strong style=""font-size:12px"">Tarih</strong></p></td><td width=""218""><p><strong style=""font-size:12px"">İmza</strong></p></td></tr></tbody></table><br><br><br><br><br><br><br><br><br><br><br><br><br></div>
<p align=""center"" style=""font-size:12px""><strong><em>GİZLİ BEYAN </em></strong><em><br>" + result.Data.StudyModel.SubDescription + @"</em><em></em></p>";

                        List<string> bookmarks = new List<string>();
                        htmlContent += "<div class='page-break'></div>";
                        int visitNo = 1;
                        int elmNo = 1;
                        result.Data.VisitModel.ForEach(visit =>
                        {
                            bookmarks.Add(visit.Title);
                            htmlContent += $"<table style=\"width:100%;\"><tbody><tr style=\"border-bottom:1px solid #ccc\"><th style=\"width:15%;\">No</th><th style=\"width:60%;\">Soru</th><th style=\"width:25%;\">Cevap</th></tr><tr style=\"color:#fff; background-color:#6D6E70; font-size:18px; text-align:Center;\"><td colspan=\"3\"><div style=\"margin:10px\"><b>{visit.Title}</b></div></td></tr>";
                            visit.Children.ForEach(page =>
                            {
                                if (page.Title != null)
                                {
                                    htmlContent += $"<tr style=\"color:#fff; background-color:#6D6E70; font-size:18px; text-align:Center;\"><td colspan=\"3\"><div style=\"margin:10px\"><b>{page.Title}</b></div></td></tr>";
                                }
                                page.Children.ForEach(module =>
                                {
                                    htmlContent += $"<tr><td colspan=\"3\"><div class=\"panel-heading\" style=\"color:#000000; background-color:#e5e5e5; font-size:18px; text-align:Center; border:1px solid #ccc;\"><b>{module.Title}</b></div></td></tr>";
                                    module.Children.ForEach(elm =>
                                    {
                                        string input = "";
                                         
                                        switch (elm.Input)
                                        {
                                            case ElementType.Text:
                                            case ElementType.Numeric:
                                            case ElementType.Calculated:
                                                input = "<input type=\"text\" style=\"width:126px; border:1px #cfd1d2 solid;color:#6D6E70;\" />";
                                                break;
                                            case ElementType.Hidden:
                                                input = "<input type=\"text\" style=\"width:126px; border:1px #cfd1d2 solid;color:#6D6E70;\" value=\"[]\" />";
                                                break;
                                            case ElementType.RadioList:
                                            case ElementType.DropDown:
                                                if (elm.ElementOptions != "")
                                                {
                                                    List<ElementOption>? elmOpts = System.Text.Json.JsonSerializer.Deserialize<List<ElementOption>>(elm.ElementOptions);
                                                    if (elmOpts != null)
                                                    {
                                                        input = "<div class=\"input-group animated fadeInLeft  helios-input helios-radio \" style=\"margin:5px 0px\"><ul style=\"list-style-type:none;margin-left:-40px;\">";
                                                        elmOpts.ForEach(elmOpt =>
                                                        {
                                                            input += $"<li><input type=\"radio\" class=\"formInputClassName\"><label> {elmOpt.tagName}</label></li>";
                                                        });
                                                        input += "</ul></div>";
                                                    }
                                                }
                                                break;
                                            case ElementType.DateOption:
                                                input += "<input type=\"date\">";
                                                break;
                                            case ElementType.CheckList:
                                            case ElementType.DropDownMulti:
                                                if (elm.ElementOptions != "")
                                                {
                                                    List<ElementOption>? elmOpts = System.Text.Json.JsonSerializer.Deserialize<List<ElementOption>>(elm.ElementOptions);
                                                    if (elmOpts != null)
                                                    {
                                                        input = "<div class=\"input-group animated fadeInLeft  helios-input helios-radio \" style=\"margin:5px 0px\"><ul style=\"list-style-type:none;margin-left:-40px;\">";
                                                        elmOpts.ForEach(elmOpt =>
                                                        {
                                                            input += $"<li><input type=\"checkbox\" class=\"formInputClassName\"><label> {elmOpt.tagName}</label></li>";
                                                        });
                                                        input += "</ul></div>";
                                                    }
                                                }
                                                break;
                                            case ElementType.Textarea:
                                                input += "<textarea rows=\"3\" cols=\"15\"></textarea>";
                                                break;
                                            case ElementType.File:
                                                input += "<label style=\"display: inline-block; padding: 6px 12px; cursor: pointer; background-color: #E5E5E5; color: black; border-radius: 4px; font-family: Arial, sans-serif; font-size: 14px; user-select: none;\">Select File</label>";
                                                break;
                                            case ElementType.RangeSlider:
                                                input += "<input type=\"range\" min=\"0\" max=\"100\" step=\"1\" value=\"50\">";
                                                break;
                                            case ElementType.DataGrid:
                                                input += @"<table border=""1""><tbody>";
                                                foreach (KeyValuePair<string, DatagridAndTableDicVal> entry in elm.DatagridAndTableValue)
                                                {
                                                    string cInput = "";
                                                    if (IsJson(entry.Value.ElementType))
                                                    {
                                                        List<ElementOption>? elmOpts = System.Text.Json.JsonSerializer.Deserialize<List<ElementOption>>(entry.Value.ElementType);
                                                        if (elmOpts != null)
                                                        {
                                                            cInput = "<div class=\"input-group animated fadeInLeft  helios-input helios-radio \" style=\"margin:5px 0px\"><ul style=\"list-style-type:none;margin-left:-40px;\">";
                                                            elmOpts.ForEach(elmOpt =>
                                                            {
                                                                cInput += $"<li><input type=\"checkbox\" class=\"formInputClassName\"><label> {elmOpt.tagName}</label></li>";
                                                            });
                                                            cInput += "</ul></div>";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        if (entry.Value.ElementType == ElementType.Text.ToString() || entry.Value.ElementType == ElementType.Numeric.ToString() || entry.Value.ElementType == ElementType.Calculated.ToString())
                                                        {
                                                            cInput = "<input type=\"text\" style=\"width:126px; border:1px #cfd1d2 solid;color:#6D6E70;\" />";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.DateOption.ToString())
                                                        {
                                                            cInput += "<input type=\"date\">";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.Textarea.ToString())
                                                        {
                                                            cInput += "<textarea rows=\"3\" cols=\"15\"></textarea>";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.File.ToString())
                                                        {
                                                            cInput += "<label style=\"display: inline-block; padding: 6px 12px; cursor: pointer; background-color: #E5E5E5; color: black; border-radius: 4px; font-family: Arial, sans-serif; font-size: 14px; user-select: none;\">Select File</label>";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.RangeSlider.ToString())
                                                        {
                                                            cInput += "<input type=\"range\" min=\"0\" max=\"100\" step=\"1\" value=\"50\">";
                                                        }
                                                    }
                                                    input += $@"<tr><th>{entry.Key}</th><td>{cInput}</td>";
                                                }
                                                input += @"</tbody></table>";
                                                break;
                                            default:
                                                break;
                                        }
                                        if (elm.Input != ElementType.Table)
                                        {
                                            htmlContent += $"<tr style=\"border-bottom:1px dashed #ccc\"><td>{visitNo}-{elmNo}</td>";
                                            if(elm.Input == ElementType.Label)
                                            {
                                                Match match = Regex.Match(elm.Title, @"font-size\s*:\s*\d+px;");
                                                Match textAlignMatch = Regex.Match(elm.Title, @"text-align\s*:\s*\w+;");
                                                Match strongMatch = Regex.Match(elm.Title, @"<strong>");
                                                string labelElm = elm.Title;
                                                if (match.Success)
                                                {
                                                    labelElm = labelElm.Replace(match.Value, "font-size:13px;");
                                                }
                                                if (textAlignMatch.Success)
                                                {
                                                    labelElm = labelElm.Replace(textAlignMatch.Value, "text-align:start;");
                                                }
                                                if (strongMatch.Success)
                                                {
                                                    labelElm = labelElm.Replace(strongMatch.Value, "");
                                                }
                                                htmlContent += $"<td colspan=\"2\">{labelElm}<br>";
                                            }
                                            else if (elm.Input == ElementType.DataGrid)
                                            {
                                                htmlContent += $"<td colspan=\"2\">{input}";
                                            }
                                            else
                                            {
                                                htmlContent += $"<td><span>{elm.Title}<br></span>";
                                            }
                                            if (elm.Description != "")
                                            {
                                                htmlContent += $"<span style=\"font-size:10px\">{elm.Description}<br></span>";
                                            }
                                            if (elm.IsRequired)
                                            {
                                                htmlContent += "<span style=\"font-size:10px\">Bu alan zorunludur.<br></span>";
                                            }
                                            if ((elm.Input == ElementType.Numeric || elm.Input == ElementType.RangeSlider) && elm.LowerLimit != "" && elm.UpperLimit != "")
                                            {
                                                htmlContent += $"<span style=\"font-size:10px\">Minimum değer:{elm.LowerLimit} - Maksimum değer:{elm.UpperLimit}</span>";
                                            }
                                            if (elm.Input == ElementType.DataGrid)
                                            {
                                                htmlContent += $"</td><td colspan=\"0\"></td></tr>";
                                            }
                                            else
                                            {
                                                htmlContent += $"</td><td>{input}</td></tr>";
                                            }                               
                                            elmNo++;
                                        }
                                    });
                                });
                            });
                            htmlContent += "</tbody></table>";
                            visitNo++;
                            elmNo = 1;
                        });
                        htmlContent += "</body></html>";

                        if (dto.IsVersion != null)
                        {
                            await AddStudyVisitAnnotatedCrfVersion(new AnnotatedVersionDTO { Version = dto.IsVersion, Pdf = htmlContent });
                        }

                        var browserFetcher = new BrowserFetcher();
                        var revisionInfo = await browserFetcher.DownloadAsync();
                        var launchOptions = new LaunchOptions
                        {
                            Headless = true,
                            Args = new[] { "--no-sandbox", "--disable-setuid-sandbox" }
                        };

                        await using var browser = await Puppeteer.LaunchAsync(launchOptions);
                        await using var page = await browser.NewPageAsync();

                        await page.SetContentAsync(htmlContent);

                        var pdfStream = await page.PdfStreamAsync(new PdfOptions
                        {
                            Format = PaperFormat.A4,
                            PrintBackground = true,
                            MarginOptions = new MarginOptions
                            {
                                Top = "60px",
                                Right = "60px",
                                Bottom = "60px",
                                Left = "60px"
                            },
                            DisplayHeaderFooter = true,
                            HeaderTemplate = "<div></div>",
                            FooterTemplate = $@"
                            <div style='width:100%;text-align:left;font-size:12px;position:absolute;left:60px;bottom:20px;'>
                               {result.Data.StudyModel.ProtocolCode}, {today}
                            </div>
                            <div style='width:100%;text-align:right;font-size:12px;position:absolute;right:60px;bottom:20px;'>
                                <span class='pageNumber'></span>/<span class='totalPages'></span>
                            </div>"
                        });
                        await browser.CloseAsync();

                        byte[] pdfBytes = new byte[pdfStream.Length];
                        pdfStream.Read(pdfBytes, 0, (int)pdfStream.Length);

                        byte[] pdfWithBookmarks = AddBookmarkToPdf(pdfBytes, bookmarks);

                        return new RestResponse<byte[]>(req)
                        {
                            Data = pdfWithBookmarks,
                            StatusCode = result.StatusCode,
                            ErrorMessage = null
                        };
                    }
                    catch (Exception e)
                    {
                        return new RestResponse<byte[]>(req)
                        {
                            Data = null,
                            StatusCode = result.StatusCode,
                            ErrorMessage = e.Message
                        };
                    }
                }

                return new RestResponse<byte[]>(req)
                {
                    Data = null,
                    StatusCode = result.StatusCode,
                    ErrorMessage = result.ErrorMessage
                };
            }
        }

        public byte[] AddBookmarkToPdf(byte[] pdfBytes, List<string> bookmarkTitles)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                PdfReader reader = new PdfReader(pdfBytes);
                using (PdfStamper stamper = new PdfStamper(reader, memoryStream))
                {
                    List<Dictionary<string, object>> outlines = new List<Dictionary<string, object>>();

                    for (int i = 0; i < bookmarkTitles.Count; i++)
                    {
                        string bookmarkTitle = bookmarkTitles[i];
                        int pageNumber = FindPageNumber(pdfBytes, bookmarkTitle);

                        if (pageNumber != -1)
                        {
                            Dictionary<string, object> bookmarkDictionary = new Dictionary<string, object>
                        {
                            { "Title", bookmarkTitle },
                            { "Action", "GoTo" },
                            { "Page", $"{pageNumber} XYZ 0 800 0" }
                        };

                            outlines.Add(bookmarkDictionary);
                        }
                    }

                    stamper.Writer.Outlines = outlines;
                }
                return memoryStream.ToArray();
            }
        }

        private int FindPageNumber(byte[] pdfBytes, string visitTitle)
        {
            using (PdfReader reader = new PdfReader(pdfBytes))
            {
                for (int pageNumber = 1; pageNumber <= reader.NumberOfPages; pageNumber++)
                {
                    string pageText = PdfTextExtractor.GetTextFromPage(reader, pageNumber);
                    if (pageText.Contains(visitTitle))
                    {
                        return pageNumber;
                    }
                }
            }
            return -1;
        }
 
        public async Task<RestResponse<List<AnnotatedCrfHistoryModel>>> GetStudyVisitAnnotatedCrfHistory()
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyVisitAnnotatedCrfHistory", Method.Get);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<List<AnnotatedCrfHistoryModel>>(req);
                if (result.IsSuccessful)
                {
                    var ids = result.Data?.Select(x => Convert.ToInt64(x.CreatedBy)).ToList();

                    var usersData = await GetUserList(ids);

                    if (usersData.IsSuccessful)
                    {
                        foreach (var ann in result.Data)
                        {
                            var usr = usersData.Data.FirstOrDefault(user => Convert.ToInt64(ann.CreatedBy) == user.Id);
                            if (usr != null)
                            {
                                ann.CreatedBy = usr.Email;
                            }
                        }
                    }
                }
                return result;
            }
        }

        async Task<RestResponse<List<AspNetUserDTO>>> GetUserList(List<Int64> AuthUserIds)
        {
            using (var client = AuthServiceClient)
            {
                string authUserIdsString = string.Join(",", AuthUserIds);
                var req = new RestRequest("AdminUser/GetUserList", Method.Get);
                req.AddParameter("AuthUserIds", authUserIdsString);
                var users = await client.ExecuteAsync<List<AspNetUserDTO>>(req);
                return users;
            }
        }

        public async Task<RestResponse<byte[]>> GetStudyVisitAnnotatedCrfHistoryPdf(Int64 id)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyVisitAnnotatedCrfHistoryPdf", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync<string?>(req);

                string protocolCode = "";
                string today = DateTime.Now.ToString("dd.MM.yyyy");
                var browserFetcher = new BrowserFetcher();
                var revisionInfo = await browserFetcher.DownloadAsync();
                var launchOptions = new LaunchOptions
                {
                    Headless = true,
                    Args = new[] { "--no-sandbox", "--disable-setuid-sandbox" }
                };

                await using var browser = await Puppeteer.LaunchAsync(launchOptions);
                await using var page = await browser.NewPageAsync();

                await page.SetContentAsync(result.Data);

                HtmlDocument htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(result.Data);

                var protocolCodeNode = htmlDoc.DocumentNode.SelectSingleNode("//*[@id='protocolcode']");

                if (protocolCodeNode != null)
                {
                    protocolCode = protocolCodeNode.InnerText;
                }

                var pdfStream = await page.PdfStreamAsync(new PdfOptions
                {
                    Format = PaperFormat.A4,
                    PrintBackground = true,
                    MarginOptions = new MarginOptions
                    {
                        Top = "60px",
                        Right = "60px",
                        Bottom = "60px",
                        Left = "60px"
                    },
                    DisplayHeaderFooter = true,
                    HeaderTemplate = "<div></div>",
                    FooterTemplate = $@"
                            <div style='width:100%;text-align:left;font-size:12px;position:absolute;left:60px;bottom:20px;'>
                                {protocolCode}, {today}
                            </div>
                            <div style='width:100%;text-align:right;font-size:12px;position:absolute;right:60px;bottom:20px;'>
                                <span class='pageNumber'></span>/<span class='totalPages'></span>
                            </div>"
                });
                await browser.CloseAsync();

                byte[] pdfBytes = new byte[pdfStream.Length];
                pdfStream.Read(pdfBytes, 0, (int)pdfStream.Length);


                return new RestResponse<byte[]>(req)
                {
                    Data = pdfBytes,
                    StatusCode = result.StatusCode,
                    ErrorMessage = null
                };

            }
        }
        #endregion

        #region Module
        public async Task<RestResponse<List<ElementModel>>> GetStudyModuleElementsWithChildren(Int64 studyVisitPageModuleId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyModuleElementsWithChildren", Method.Get);
                req.AddParameter("studyModuleId", studyVisitPageModuleId);
                var result = await client.ExecuteAsync<List<ElementModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> SaveVisitPageModuleContent(ElementModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SaveVisitPageModuleContent", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> CopyElement(Int64 id, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/CopyElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteElement(Int64 id, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<ApiResponse<dynamic>> CopyTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                RowIndex = rowIndex,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/CopyTableRowElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<ApiResponse<dynamic>> DeleteTableRowElement(Int64 id, int rowIndex, Int64 userId)
        {
            var model = new ElementShortModel()
            {
                Id = id,
                RowIndex = rowIndex,
                UserId = userId,
                Value = ""
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/DeleteTableRowElement", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<List<ElementModel>> GetVisitPageModuleAllElements(Int64 id)
        {
            var elements = new List<ElementModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitPageModuleAllElements", Method.Get);
                req.AddParameter("visitPageModuleId", id);
                var result = await client.ExecuteAsync(req);
                //elements = JsonSerializer.Deserialize<List<ElementModel>>(result.Content);
                elements = JsonConvert.DeserializeObject<List<ElementModel>>(result.Content);
            }

            return elements;
        }

        public async Task<ElementModel> GetVisitPageModuleElementData(Int64 id)
        {
            var element = new ElementModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitPageModuleElementData", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync(req);
                //element = JsonSerializer.Deserialize<ElementModel>(result.Content);
                element = JsonConvert.DeserializeObject<ElementModel>(result.Content);
            }

            return element;
        }

        public async Task<ModuleModel> GetStudyPageModule(Int64 id)
        {
            var module = new ModuleModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetStudyPageModule", Method.Get);
                req.AddParameter("id", id);
                var result = await client.ExecuteAsync(req);
                //module = JsonSerializer.Deserialize<ModuleModel>(result.Content);
                module = JsonConvert.DeserializeObject<ModuleModel>(result.Content);
            }

            return module;
        }

        public async Task<ApiResponse<dynamic>> SetVisitRanking(List<VisitDTO> dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/SetVisitRanking", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                if (result.Data.IsSuccess)
                {
                    var data = await GetVisits(StudyId);
                    await _liveDataHub.Clients.Group("Visit").SendAsync("LiveData", new Dictionary<string, object> { { "data", data }, { "message", Name } });
                }
                return result.Data;
            }
        }

        public async Task<VisitCollectionModel> GetVisitCollectionInfo(Int64 elementId)
        {
            var module = new VisitCollectionModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetVisitCollectionInfo", Method.Get);
                req.AddParameter("elementId", elementId);
                var result = await client.ExecuteAsync(req);
                //module = JsonSerializer.Deserialize<VisitCollectionModel>(result.Content);
                module = JsonConvert.DeserializeObject<VisitCollectionModel>(result.Content);
            }

            return module;
        }

        public async Task<List<Int64>> GetDependentHideElement(string targetElementIds, string? pValue)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetDependentHideElement", Method.Get);
                req.AddParameter("targetElementString", targetElementIds);
                req.AddParameter("padeId", 0);
                req.AddParameter("subjectId", 0);
                req.AddParameter("pValue", pValue);
                var result = await client.ExecuteAsync<List<Int64>>(req);
                return result.Data;
            }
        }

        #endregion
    }
}
