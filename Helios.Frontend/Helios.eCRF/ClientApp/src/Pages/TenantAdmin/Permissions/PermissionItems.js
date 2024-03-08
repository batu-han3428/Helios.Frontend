const permissionItems = {
    Subject: [
        {
            label: "Add",
            key: 100
        },
        {
            label: "View",
            key: 101
        },
        {
            label: "Edit",
            key: 102
        },
        {
            label: "Archive",
            key: 103
        },
        {
            label: "Delete",
            key: 104
        },
        {
            label: "Change state",
            key: 105
        },
        {
            label: "Randomize",
            key: 106
        },
        {
            label: "View randomization",
            key: 107
        },
        {
            label: "View e-Consent",
            key: 108
        },
        {
            label: "Export subject form",
            key: 109
        },
        {
            label: "Signature",
            key: 110
        },
    ],
    Monitoring: [
        {
            label: "On-site SDV",
            key: "sdv"
        },
        {
            label: "Verification",
            key: "verification"
        },
        {
            label: "Remote SDV",
            key: "remoteSdv"
        },
        {
            label: "Query",
            key: "queryView"
        },
        {
            label: "Close auto query",
            key: "autoQueryClosed"
        },
        {
            label: "Lock",
            key: "lock"
        },
        {
            label: "Unlock",
            key: "hasPageUnLock"
        },
        {
            label: "Freeze",
            key: "hasPageFreeze"
        },
        {
            label: "Unfreeze",
            key: "hasPageUnFreeze"
        },
        {
            label: "Lock-Freeze audit trails",
            key: "seePageActionAudit"
        },
        {
            label: "Input audit trail",
            key: "inputAuditTrail"
        },
        {
            label: "Missing data",
            key: "markAsNull"
        },
    ],
    Form: [
        {
            label: "Add multi-form",
            key: "addMultiVisit"
        },
        {
            label: "Archive multi-form",
            key: "archiveMultiVisit"
        },
        {
            label: "Remove multi-form",
            key: "removeMultiVisit"
        },
        {
            label: "Add adverse event",
            key: "addAdverseEvent"
        },
        {
            label: "Archive adverse event",
            key: "aeArchive"
        },
        {
            label: "Remove adverse event",
            key: "aeRemove"
        },
    ],
    "File upload": [
        {
            label: "View",
            key: "canFileView"
        },
        {
            label: "Upload",
            key: "canFileUpload"
        },
        {
            label: "Download",
            key: "canFileDownload"
        },
        {
            label: "Delete",
            key: "canFileDeleted"
        },
    ],
    "Study document": [
        {
            label: "View",
            key: "studyFoldersView"
        },
    ],
    DashboardOld: [
        {
            label: "Subject state",
            key: "subjectstate"
        },
        {
            label: "Query status",
            key: "querystatus"
        },
        {
            label: "Randomization",
            key: "randomization"
        },
        {
            label: "SDV status",
            key: "sdvstatus"
        },
        {
            label: "Total subject number",
            key: "totalsubjectnumber"
        },
        {
            label: "Randomization Total subject number by country/ site",
            key: "randomizationtotalsubjectnumberbycountrysite"
        },
    ],											
    "Data export":[
        {
            label: "Full study report",
            key: "fullstudyreport"
        },
        {
            label: "Study report",
            key: "studyreports"
        },
        {
            label: "Query report",
            key: "queryreport"
        },
        {
            label: "Comment report",
            key: "commentreport"
        },
        {
            label: "Form data report",
            key: "formdatareport"
        },
        {
            label: "Input audit trail report",
            key: "inputaudittrailreport"
        },
        {
            label: "Missing SDV data report",
            key: "missingsdvdatareport"
        },
        {
            label: "Missing data report",
            key: "missingdatareport"
        },
        {
            label: "Adverse event detail report",
            key: "adverseeventdetailreport"
        },
        {
            label: "Serious adverse event detail report",
            key: "seriousadverseeventdetailreport"
        },
        {
            label: "Form detail report",
            key: "formdetailreport"
        },
        {
            label: "Subject state with randomization",
            key: "subjectstatewithrandomization"
        },
        {
            label: "MRI file report",
            key: "mrifilereport"
        },
        {
            label: "Missing data summary report",
            key: "missingdatasummary"
        },
        {
            label: "Randomization audit trail report",
            key: "randomizationaudittrailreport"
        },
        {
            label: "Randomization treatment group report",
            key: "randomizationtreatmentgroupreport"
        },
        {
            label: "Custom coding report",
            key: "customcodingreport"
        },
        {
            label: "File attachment detail report",
            key: "fileattachmentdetailreport"
        },
        {
            label: "Metadata report",
            key: "metadatareport"
        },
        {
            label: "Local lab report",
            key: "locallabreport"
        },
        {
            label: "Lock/Freeze status report",
            key: "lockfreezestatusreport"
        },
    ],																					
    IWRS:[
        {
            label: "Transfer",
            key: "iwrsTransfer"
        },
        {
            label: "Receive",
            key: "iwrsMarkAsRecieved"
        },
    ],											
    "Medical coding":[
        {
            label: "Code",
            key: "canCode"
        },
    ],
    Dashboard:[
        {
            label: "Dashboard Admin",
            key: "dashboardBuilderAdmin"
        },
        {
            label: "Download Pivot",
            key: "dashboardBuilderPivotExport"
        },
        {
            label: "Download Source Data",
            key: "dashboardBuilderSourceExport"
        },
    ],
    TMF:[
        {
            label: "Admin",
            key: "tmfAdmin"
        },
        {
            label: "View & Download",
            key: "viewdownload"
        },
        {
            label: "Update",
            key: "update"
        },
        {
            label: "Add & Upload",
            key: "addupload"
        },
        {
            label: "Add placeholder",
            key: "addplaceholder"
        },
        {
            label: "View audit trail",
            key: "viewaudittrail"
        },
        {
            label: "Delete",
            key: "delete"
        },
        {
            label: "Preview",
            key: "preview"
        },
        {
            label: "Request",
            key: "request"
        },
        {
            label: "Approve & Reject file",
            key: "approverejectfile"
        },
        {
            label: "Comment",
            key: "comment"
        },
        {
            label: "Quality approval",
            key: "qualityapproval"
        },
        {
            label: "History",
            key: "history"
        },
        {
            label: "View file status",
            key: "viewfilestatus"
        },
        {
            label: "Unblinded",
            key: "unblinded"
        },
        {
            label: "Share",
            key: "share"
        },
    ],
};

export default permissionItems;