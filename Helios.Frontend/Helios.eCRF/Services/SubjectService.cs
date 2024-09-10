using Helios.Common.DTO;
using Helios.Common.Model;
using Helios.eCRF.Services.Base;
using Helios.eCRF.Services.Interfaces;
using iTextSharp.text.pdf.parser;
using iTextSharp.text.pdf;
using PuppeteerSharp.Media;
using PuppeteerSharp;
using RestSharp;
using System.Text.RegularExpressions;
using Helios.Common.Enums;

namespace Helios.eCRF.Services
{
    public class SubjectService : ApiBaseService, ISubjectService
    {
        public SubjectService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        public async Task<RestResponse<List<SubjectListModel>>> GetSubjectList(Int64 studyId, bool showArchivedSubjects)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectList", Method.Get);
                req.AddJsonBody(new SubjectListFilterDTO()
                {
                    StudyId = studyId,
                    UserId = UserId,
                    ShowArchivedSubjects = showArchivedSubjects,
                });
                var result = await client.ExecuteAsync<List<SubjectListModel>>(req);
                return result;
            }
        }      
        public async Task<ApiResponse<dynamic>> AddSubject(SubjectDTO SubjectDTO)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/AddSubject", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(SubjectDTO);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }
        public async Task<RestResponse<List<SiteModel>>> GetSites(Int64 studyId)
        {
            var model = new SubjectDTO
            {
                StudyId = studyId,
                SiteId = 3,
                SubjectNumber = "",
                InitialName = "",
                AddedByName = "",
                Country = "",
                RandomData = "",
                SiteName = "",
            };

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSites", Method.Post);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<List<SiteModel>>(req);
                return result;
            }
        }

        public async Task<List<SubjectDetailMenuModel>> GetSubjectDetailMenu(Int64 studyId, Int64 subjectId)
        {
            var retResult = new List<SubjectDetailMenuModel>();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectDetailMenu", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<SubjectDetailMenuModel>>(req);
                retResult = result.Data;
            }

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreStudy/GetRelationHidePage", Method.Get);
                req.AddParameter("subjectId", subjectId);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<List<Int64>>(req);
                if (result.IsSuccessful && result.Data.Count > 0)
                {
                    //TO DO : Bu kısımda visit relation tetiklenerek diğer sayfa ve vizitlerde bulunan verileri silmektedir. Veriler silindiğine dair sistem audit buradan atılmalıdır.
                    string pageIdsString = string.Join(",", result.Data);
                    var req2 = new RestRequest("CoreSubject/SetDependentPageElementValue?pageIdString=" + pageIdsString + "&subjectId=" + subjectId, Method.Post);
                    AddApiHeaders(req2);
                    var result2 = await client.ExecuteAsync<bool>(req2);
                    if (result2.IsSuccessful && result2.Data) RemoveHiddenPages(retResult, result.Data);
                }
            }

            return retResult;
        }

        public async Task<UserPermissionModel> GetUserPermissions(Int64 studyId)
        {
            var retResult = new UserPermissionModel();

            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetUserPermissions", Method.Get);
                req.AddParameter("studyId", studyId);
                req.AddParameter("userId", UserId);
                var result = await client.ExecuteAsync<UserPermissionModel>(req);
                retResult = result.Data;
            }

            return retResult;
        }

        private static void RemoveHiddenPages(List<SubjectDetailMenuModel> menus, List<Int64> hidePages)
        {
            menus.RemoveAll(menu =>
            {
                if (menu.Children != null)
                {
                    menu.Children.RemoveAll(child =>
                    {
                        RemoveHiddenPagesRecursive(child, hidePages);
                        return hidePages.Contains(child.Id);
                    });

                    return menu.Children.Count == 0;
                }

                return hidePages.Contains(menu.Id);
            });
        }

        private static void RemoveHiddenPagesRecursive(SubjectDetailMenuModel menu, List<long> hidePages)
        {
            if (menu.Children != null)
            {
                menu.Children.RemoveAll(child =>
                {
                    RemoveHiddenPagesRecursive(child, hidePages);
                    return hidePages.Contains(child.Id);
                });
            }
        }

        public async Task<RestResponse<List<SubjectElementModel>>> GetSubjectElementList(Int64 subjectId, Int64 subjectVisitModulePageId, int rowIndex)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectElementList", Method.Get);
                req.AddParameter("subjectId", subjectId);
                req.AddParameter("pageId", subjectVisitModulePageId);
                req.AddParameter("rowIndex", rowIndex);
                var result = await client.ExecuteAsync<List<SubjectElementModel>>(req);

                if (result.IsSuccessful && result.Data.Count > 0)
                {
                    var targetElementIds = result.Data
                        .Where(x => x.IsDependent || (x.ChildElements != null && x.ChildElements.Any(ce => ce.IsDependent)))
                        .SelectMany(x => new[] { x.StudyVisitPageModuleElementId }
                                         .Concat(x.ChildElements != null ? x.ChildElements.Where(ce => ce.IsDependent).Select(ce => ce.StudyVisitPageModuleElementId) : Enumerable.Empty<Int64>()))
                        .Distinct();
                    string targetElementIdsString = string.Join(",", targetElementIds);

                    if (!String.IsNullOrEmpty(targetElementIdsString))
                    {
                        var req1 = new RestRequest("CoreStudy/GetDependentHideElement", Method.Get);
                        req1.AddParameter("targetElementString", targetElementIdsString);
                        req1.AddParameter("pageId", subjectVisitModulePageId);
                        req1.AddParameter("subjectId", subjectId);
                        var result1 = await client.ExecuteAsync<List<Int64>>(req1);
                        if (result1.IsSuccessful && result1.Data.Count > 0)
                        {
                            string elementIds = string.Join(",", result1.Data);
                            var req2 = new RestRequest("CoreSubject/SetDependentElementValue?elementIdString="+elementIds+ "&pageId="+subjectVisitModulePageId+ "&subjectId="+ subjectId, Method.Post);
                            AddApiHeaders(req2);
                            var result2 = await client.ExecuteAsync<bool>(req2);

                            if (result2.IsSuccessful && result2.Data) RemoveHiddenElements(result.Data, result1.Data);
                        }
                    }
                }
                
                return result;
            }
        }

        private static void RemoveHiddenElements(List<SubjectElementModel> data, List<long> hideElements)
        {
            data.ForEach(element =>
            {
                if (element.ChildElements != null)
                {
                    element.ChildElements.RemoveAll(child => hideElements.Contains(child.SubjectVisitPageModuleElementId));
                }
            });

            data.RemoveAll(element => hideElements.Contains(element.SubjectVisitPageModuleElementId));
        }

        public async Task<ApiResponse<dynamic>> AutoSaveSubjectData(SubjectElementShortModel model)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/AutoSaveSubjectData", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(model);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> AddDatagridSubjectElements(Int64 datagridId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest($"CoreSubject/AddDatagridSubjectElements?datagridId={datagridId}", Method.Post);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> RemoveDatagridSubjectElements(DatagridRemoveDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/RemoveDatagridSubjectElements", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<bool> GetStudyAskSubjectInitial(Int64 studyId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetStudyAskSubjectInitial", Method.Get);
                req.AddParameter("studyId", studyId);
                var result = await client.ExecuteAsync<bool>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> DeleteOrArchiveSubject(SubjectArchiveOrDeleteModel model)
        {
            if (model.IsArchived)
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest("CoreSubject/UnArchiveSubject", Method.Post);
                    req.AddJsonBody(model);
                    var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                    return result.Data;
                }
            }
            else
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest("CoreSubject/DeleteOrArchiveSubject", Method.Post);
                    req.AddJsonBody(model);
                    var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                    return result.Data;
                }
            }
        }

        public static bool IsJson(string input)
        {
            input = input.Trim();
            return (input.StartsWith("{") && input.EndsWith("}")) ||
                   (input.StartsWith("[") && input.EndsWith("]"));
        }

        class ElementOption
        {
            public int id { get; set; }
            public string tagKey { get; set; }
            public string tagName { get; set; }
            public string tagValue { get; set; }
        }

        public async Task<RestResponse<byte[]>> GetSubjectVisitAnnotatedCrf(Int64 subjectId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectVisitAnnotatedCrf", Method.Get);
                AddApiHeaders(req);
                req.AddParameter("subjectId", subjectId);
                var result = await client.ExecuteAsync<StudyVisitAnnotatedCrfModel>(req);

                if (result.IsSuccessful && result.Data != null)
                {
                    try
                    {
                        string today = DateTime.Now.ToString("dd.MM.yyyy");
                        string htmlContent = @"<!DOCTYPE html><html lang=""en""><head><meta charset=""UTF-8""><meta name=""viewport"" content=""width=device-width, initial-scale=1.0""><title>PDF Oluştur</title><style>table {border: dashed #ccc;border-width: 0 1px 0 1px;}table td {border: dashed #ccc;border-width: 1px 0 1px 0;}</style></head><body><br>Protokol Kod: <span id=""protocolcode"">" + result.Data.StudyModel.ProtocolCode + @"</span><br>Hasta Numarası: <span>" + result.Data.StudyModel.SubjectNumber+ "</span><div><br/></div>";

                        List<string> bookmarks = new List<string>();
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
                                    htmlContent += $"<tr style=\"color:#fff; background-color:#a4a7ad; font-size:18px; text-align:Center;\"><td colspan=\"3\"><div style=\"margin:10px\"><b>{page.Title}</b></div></td></tr>";
                                    if (page.Children.Count < 1) htmlContent += "<tr style=\"text-align:Center;\"><td colspan=\"3\">No data has been entered on this page</td></tr>";
                                }
                                page.Children.ForEach(module =>
                                {
                                    htmlContent += $"<tr><td colspan=\"3\"><div class=\"panel-heading\" style=\"color:#000000; background-color:#e5e5e5; font-size:18px; text-align:Center; border:1px solid #ccc;\"><b>{module.Title}</b></div></td></tr>";
                                    module.Children.ForEach(elm =>
                                    {
                                        string input = "";
                                        string? val = elm.UserValue;
                                        switch (elm.Input)
                                        {
                                            case ElementType.Text:
                                            case ElementType.Numeric:
                                            case ElementType.Calculated:
                                                input = val;
                                                break;
                                            case ElementType.Hidden:
                                                input = "<input type=\"text\" style=\"width:126px; border:1px #cfd1d2 solid;color:#6D6E70;\" value=\"[]\" />";
                                                break;
                                            case ElementType.RadioList:
                                            case ElementType.DropDown:
                                                if (elm.ElementOptions != "")
                                                {
                                                    input += val;
                                                }
                                                break;
                                            case ElementType.DateOption:
                                                input += "<input type=\"text\" value=\"" + val + "\">";
                                                break;
                                            case ElementType.CheckList:
                                            case ElementType.DropDownMulti:
                                                if (elm.ElementOptions != "")
                                                {
                                                    input += val;
                                                }
                                                break;
                                            case ElementType.Textarea:
                                                input += $"<label>{val}</label>";
                                                break;
                                            case ElementType.File:
                                                input += "<label style=\"display: inline-block; padding: 6px 12px; cursor: pointer; background-color: #E5E5E5; color: black; border-radius: 4px; font-family: Arial, sans-serif; font-size: 14px; user-select: none;\">Select File</label>";
                                                break;
                                            case ElementType.RangeSlider:
                                                input += val;
                                                break;
                                            case ElementType.DataGrid:
                                                foreach (KeyValuePair<string, DatagridAndTableDicVal> entry in elm.DatagridAndTableValue)
                                                {
                                                    string cInput = "";
                                                    if (IsJson(entry.Value.ElementType))
                                                    {
                                                        List<ElementOption>? elmOpts = System.Text.Json.JsonSerializer.Deserialize<List<ElementOption>>(entry.Value.ElementType);
                                                        if (elmOpts != null)
                                                        {
                                                            var cInputVal = elmOpts.Where(x => x.tagValue == entry.Value.Value).Select(x => x.tagName).FirstOrDefault();
                                                            cInput = $"<label>{cInputVal}</label>";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        if (entry.Value.ElementType == ElementType.Text.ToString() || entry.Value.ElementType == ElementType.Numeric.ToString() || entry.Value.ElementType == ElementType.Calculated.ToString())
                                                        {
                                                            cInput = $"<label>{entry.Value.Value}</label>";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.DateOption.ToString())
                                                        {
                                                            cInput = $"<input type=\"text\" style=\"width:126px; border:1px #cfd1d2 solid;color:#6D6E70;\" value=\"{entry.Value.Value}\" />";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.Textarea.ToString())
                                                        {
                                                            cInput += $"<label>{entry.Value.Value}</label>";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.File.ToString())
                                                        {
                                                            cInput += "<label style=\"display: inline-block; padding: 6px 12px; cursor: pointer; background-color: #E5E5E5; color: black; border-radius: 4px; font-family: Arial, sans-serif; font-size: 14px; user-select: none;\">Select File</label>";
                                                        }
                                                        else if (entry.Value.ElementType == ElementType.RangeSlider.ToString())
                                                        {
                                                            cInput += entry.Value.Value;
                                                        }
                                                    }
                                                    htmlContent += $"<tr style=\"border-bottom:1px dashed #ccc\"><td>{visitNo}-{elmNo}</td><td><span>{entry.Value.ColonName}<br></span></td><td>{cInput}</td></tr>";
                                                    elmNo++;
                                                }
                                                break;
                                            default:
                                                break;
                                        }
                                        if (elm.Input != ElementType.Table && elm.Input != ElementType.DataGrid)
                                        {
                                            htmlContent += $"<tr style=\"border-bottom:1px dashed #ccc\"><td>{visitNo}-{elmNo}</td>";
                                            if (elm.Input == ElementType.Label)
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
                                            else if(elm.Input != ElementType.DataGrid)
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
                                                htmlContent += $"</td><td>{input}</td></tr>";
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

        public async Task<RestResponse<List<SubjectCommentModel>>> GetSubjectComments(Int64 subjectElementId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectComments", Method.Get);
                req.AddParameter("subjectElementId", subjectElementId);
                var result = await client.ExecuteAsync<List<SubjectCommentModel>>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<SubjectElementShortModel>>> GetRelationPageElementValues(Int64 subjectVisitPageModuleElementId, Int64 studyId, string? value, Int64 subjectId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetRelationPageElementValues", Method.Get);
                req.AddParameter("subjectVisitPageModuleElementId", subjectVisitPageModuleElementId);
                req.AddParameter("studyId", studyId);
                req.AddParameter("value", value);
                req.AddParameter("subjectId", subjectId);
                req.AddParameter("subjectVisitPageModuleElementId", subjectVisitPageModuleElementId);
                var result = await client.ExecuteAsync<List<SubjectElementShortModel>>(req);
                return result;
            }
        }

        public async Task<ApiResponse<dynamic>> RemoveSubjectComment(Int64 id)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest($"CoreSubject/RemoveSubjectComment?id={id}", Method.Post);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetSubjectComment(SubjectCommentDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/SetSubjectComment", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetSubjectMissingData(SubjectMissingDataDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/SetSubjectMissingData", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<ApiResponse<dynamic>> SetSubjectSdv(List<Int64> ids)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/SetSubjectSdv", Method.Post);
                req.AddJsonBody(ids);
                req.AddHeader("Content-Type", "application/json");
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<List<SubjectMultiDTO>>> GetSubjectMultiList(Int64 subjectId, Int64 studyVisitId, bool showArchivedMulties)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectMultiList", Method.Get);
                req.AddParameter("subjectId", subjectId);
                req.AddParameter("studyVisitId", studyVisitId);
                req.AddParameter("showArchivedMulties", showArchivedMulties);
                var result = await client.ExecuteAsync<List<SubjectMultiDTO>>(req);
                return result;
            }

        }

        public async Task<ApiResponse<dynamic>> AddSubjectMultiForm(Int64 subjectId, Int64 studyVisitId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest($"CoreSubject/AddSubjectMultiForm?subjectId={subjectId}&studyVisitId={studyVisitId}", Method.Post);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<List<SdvModel>>> GetSubjectSdvList()
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectSdvList", Method.Get);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<List<SdvModel>>(req);
                return result;
            }
        }
        
        public async Task<ApiResponse<dynamic>> DeleteOrArchiveSubjectMultiForm(SubjectMultiFormArchiveOrDeleteModel model, bool unArchive)
        {
            if (!unArchive)
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest($"CoreSubject/DeleteOrArchiveSubjectMultiForm", Method.Post);
                    AddApiHeaders(req);
                    req.AddJsonBody(model);
                    var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                    return result.Data;
                }
            }
            else
            {
                using (var client = CoreServiceClient)
                {
                    var req = new RestRequest($"CoreSubject/UnArchiveSubjectMultiForm", Method.Post);
                    AddApiHeaders(req);
                    req.AddJsonBody(model);
                    var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                    return result.Data;
                }
            }
        }

        public async Task<ApiResponse<dynamic>> SetSubjectQuery(SubjectQueryDTO dto)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/SetSubjectQuery", Method.Post);
                AddApiHeaders(req);
                req.AddJsonBody(dto);
                var result = await client.ExecuteAsync<ApiResponse<dynamic>>(req);
                return result.Data;
            }
        }

        public async Task<RestResponse<List<SubjectQueryModel>>> GetSubjectQueries(Int64 subjectElementId)
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectQueries", Method.Get);
                req.AddParameter("subjectElementId", subjectElementId);
                var result = await client.ExecuteAsync<List<SubjectQueryModel>>(req);
                return result;
            }
        }

        public async Task<RestResponse<List<QueryListModel>>> GetSubjectQueryList()
        {
            using (var client = CoreServiceClient)
            {
                var req = new RestRequest("CoreSubject/GetSubjectQueryList", Method.Get);
                AddApiHeaders(req);
                var result = await client.ExecuteAsync<List<QueryListModel>>(req);
                return result;
            }
        }
    }
}
