const permissionItems = {
    Subject: [
        {
            label: "Add",
            name: "add"
        },
        {
            label: "View",
            name: "view"
        },
        {
            label: "Edit",
            name: "edit"
        },
        {
            label: "Archive",
            name: "archivePatient"
        },
        {
            label: "Delete",
            name: "removePatient"
        },
        {
            label: "Change state",
            name: "patientStateChange"
        },
        {
            label: "Randomize",
            name: "randomize"
        },
        {
            label: "View randomization",
            name: "viewRandomization"
        },
        {
            label: "View e-Consent",
            name: "eConsentView"
        },
        {
            label: "Export subject form",
            name: "exportPatientForm"
        },
        {
            label: "Signature",
            name: "sign"
        },
    ],
    Monitoring: [
        {
            label: "On-site SDV",
            name: "sdv"
        },
        {
            label: "Verification",
            name: "verification"
        },
        {
            label: "Remote SDV",
            name: "remoteSdv"
        },
        {
            label: "Query",
            name: "queryView"
        },
        {
            label: "Close auto query",
            name: "autoQueryClosed"
        },
        {
            label: "Lock",
            name: "lock"
        },
        {
            label: "Unlock",
            name: "hasPageUnLock"
        },
        {
            label: "Freeze",
            name: "hasPageFreeze"
        },
        {
            label: "Unfreeze",
            name: "hasPageUnFreeze"
        },
        {
            label: "Lock-Freeze audit trails",
            name: "seePageActionAudit"
        },
        {
            label: "Input audit trail",
            name: "inputAuditTrail"
        },
        {
            label: "Missing data",
            name: "markAsNull"
        },
    ],
    Form: [
        {
            label: "Add multi-form",
            name: "addMultiVisit"
        },
        {
            label: "Archive multi-form",
            name: "archiveMultiVisit"
        },
        {
            label: "Remove multi-form",
            name: "removeMultiVisit"
        },
        {
            label: "Add adverse event",
            name: "addAdverseEvent"
        },
        {
            label: "Archive adverse event",
            name: "aeArchive"
        },
        {
            label: "Remove adverse event",
            name: "aeRemove"
        },
    ],
    "File upload": [
        {
            label: "View",
            name: "canFileView"
        },
        {
            label: "Upload",
            name: "canFileUpload"
        },
        {
            label: "Download",
            name: "canFileDownload"
        },
        {
            label: "Delete",
            name: "canFileDeleted"
        },
    ],
    "Study document": [
        {
            label: "View",
            name: "studyFoldersView"
        },
    ],
    DashboardOld: [
        {
            label: "Subject state",
            name: "subjectstate"
        },
        {
            label: "Query status",
            name: "querystatus"
        },
        {
            label: "Randomization",
            name: "randomization"
        },
        {
            label: "SDV status",
            name: "sdvstatus"
        },
        {
            label: "Total subject number",
            name: "totalsubjectnumber"
        },
        {
            label: "Randomization Total subject number by country/ site",
            name: "randomizationtotalsubjectnumberbycountrysite"
        },
    ],											
    "Data export":[
        {
            label: "Full study report",
            name: "fullstudyreport"
        },
        {
            label: "Study report",
            name: "studyreports"
        },
        {
            label: "Query report",
            name: "queryreport"
        },
        {
            label: "Comment report",
            name: "commentreport"
        },
        {
            label: "Form data report",
            name: "formdatareport"
        },
        {
            label: "Input audit trail report",
            name: "inputaudittrailreport"
        },
        {
            label: "Missing SDV data report",
            name: "missingsdvdatareport"
        },
        {
            label: "Missing data report",
            name: "missingdatareport"
        },
        {
            label: "Adverse event detail report",
            name: "adverseeventdetailreport"
        },
        {
            label: "Serious adverse event detail report",
            name: "seriousadverseeventdetailreport"
        },
        {
            label: "Form detail report",
            name: "formdetailreport"
        },
        {
            label: "Subject state with randomization",
            name: "subjectstatewithrandomization"
        },
        {
            label: "MRI file report",
            name: "mrifilereport"
        },
        {
            label: "Missing data summary report",
            name: "missingdatasummary"
        },
        {
            label: "Randomization audit trail report",
            name: "randomizationaudittrailreport"
        },
        {
            label: "Randomization treatment group report",
            name: "randomizationtreatmentgroupreport"
        },
        {
            label: "Custom coding report",
            name: "customcodingreport"
        },
        {
            label: "File attachment detail report",
            name: "fileattachmentdetailreport"
        },
        {
            label: "Metadata report",
            name: "metadatareport"
        },
        {
            label: "Local lab report",
            name: "locallabreport"
        },
        {
            label: "Lock/Freeze status report",
            name: "lockfreezestatusreport"
        },
    ],																					
    IWRS:[
        {
            label: "Transfer",
            name: "iwrsTransfer"
        },
        {
            label: "Receive",
            name: "iwrsMarkAsRecieved"
        },
    ],											
    "Medical coding":[
        {
            label: "Code",
            name: "canCode"
        },
    ],
    Dashboard:[
        {
            label: "Dashboard Admin",
            name: "dashboardBuilderAdmin"
        },
        {
            label: "Download Pivot",
            name: "dashboardBuilderPivotExport"
        },
        {
            label: "Download Source Data",
            name: "dashboardBuilderSourceExport"
        },
    ],
    TMF:[
        {
            label: "Admin",
            name: "tmfAdmin"
        },
        {
            label: "View & Download",
            name: "viewdownload"
        },
        {
            label: "Update",
            name: "update"
        },
        {
            label: "Add & Upload",
            name: "addupload"
        },
        {
            label: "Add placeholder",
            name: "addplaceholder"
        },
        {
            label: "View audit trail",
            name: "viewaudittrail"
        },
        {
            label: "Delete",
            name: "delete"
        },
        {
            label: "Preview",
            name: "preview"
        },
        {
            label: "Request",
            name: "request"
        },
        {
            label: "Approve & Reject file",
            name: "approverejectfile"
        },
        {
            label: "Comment",
            name: "comment"
        },
        {
            label: "Quality approval",
            name: "qualityapproval"
        },
        {
            label: "History",
            name: "history"
        },
        {
            label: "View file status",
            name: "viewfilestatus"
        },
        {
            label: "Unblinded",
            name: "unblinded"
        },
        {
            label: "Share",
            name: "share"
        },
    ],
};

export default permissionItems;