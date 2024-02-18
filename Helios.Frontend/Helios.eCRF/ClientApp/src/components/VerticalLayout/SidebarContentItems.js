const menuItems = {
    common: [
        {
            label: "Home",
            to: "/home",
        },
        {
            label: "About",
            to: "/about",
        },
    ],
    admin: [
        {
            label: "Studies",
            icon: "fa-solid fa-folder-tree",
            subMenu: [
                {
                    label: "Active",
                    to: "/studylist",
                    icon: "fa-solid fa-lock-open"
                },
                {
                    label: "Locked",
                    to: "/lockedlist",
                    icon: "fa-solid fa-lock"
                }
            ],
        },
        {
            label: "Module",
            to: "/moduleList",
            icon: "fa-solid fa-puzzle-piece"
        },
        {
            label: "Dashboard",
            to: "/dashboard",
        },
        {
            label: "Email",
            subMenu: [
                {
                    label: "Inbox",
                    to: "/email-inbox",
                },
                {
                    label: "Email Read",
                    to: "/email-read",
                },
                {
                    label: "Email Compose",
                    to: "/email-compose",
                },
            ],
        },
        {
            label: "UI Elements",
            subMenu: [
                {
                    label: "Alerts",
                    to: "/ui-alerts",
                },
                {
                    label: "Buttons",
                    to: "/ui-buttons",
                },
                {
                    label: "Cards",
                    to: "/ui-cards",
                },
                {
                    label: "Carousel",
                    to: "/ui-carousel",
                },
                {
                    label: "Dropdowns",
                    to: "/ui-dropdowns",
                },
                {
                    label: "Grid",
                    to: "/ui-grid",
                },
                {
                    label: "Lightbox",
                    to: "/ui-lightbox",
                },
                {
                    label: "Modals",
                    to: "/ui-modals",
                },
                {
                    label: "Offcanvas",
                    to: "/ui-offcanvas",
                },
                {
                    label: "Slider",
                    to: "/ui-rangeslider",
                },
                {
                    label: "Session Timeout",
                    to: "/ui-session-timeout",
                },
                {
                    label: "Progress Bars",
                    to: "/ui-progressbars",
                },
                {
                    label: "Tabs & Accordions",
                    to: "/ui-tabs-accordions",
                },
                {
                    label: "Typography",
                    to: "/ui-typography",
                },
                {
                    label: "Video",
                    to: "/ui-video",
                },
                {
                    label: "General",
                    to: "/ui-general",
                },
                {
                    label: "Colors",
                    to: "/ui-colors",
                },
                {
                    label: "Rating",
                    to: "/ui-rating",
                },
                {
                    label: "Utilities",
                    to: "/ui-utilities",
                },
                {
                    label: "Utilities",
                    to: "/ui-utilities",
                },
            ],
        },
        {
            label: "Forms",
            subMenu: [
                {
                    label: "Form Elements",
                    to: "/form-elements",
                },
                {
                    label: "Form Validation",
                    to: "/form-validation",
                },
                {
                    label: "Form Advanced",
                    to: "/form-advanced",
                },
                {
                    label: "Form Editors",
                    to: "/form-editors",
                },
                {
                    label: "Form File Upload",
                    to: "/form-uploads",
                },
                {
                    label: "Form Xeditable",
                    to: "/form-xeditable",
                },
                {
                    label: "Form Repeater",
                    to: "/form-repeater",
                },
                {
                    label: "Form Wizard",
                    to: "/form-wizard",
                },
                {
                    label: "Form Mask",
                    to: "/form-mask",
                },
            ]
        },
        {
            label: "Tables",
            subMenu: [
                {
                    label: "Basic Tables",
                    to: "/tables-basic"
                },
                {
                    label: "Data Tables",
                    to: "/tables-datatable"
                },
                {
                    label: "Responsive Table",
                    to: "/tables-responsive"
                },
                {
                    label: "Editable Table",
                    to: "/tables-editable"
                },
            ]
        },
        {
            label: "Users",
            to: "/tenantusers",
            icon: "fa-solid fa-user-plus"
        }
    ],
    study: [
        {
            label: "Admin page",
            to: "/",
            icon: "fa-solid fa-house"
        },
        {
            label: "Go to active study",
            to: "/invalid",
            isDemo: false,
            icon: "fa-solid fa-toggle-off"
        },
        {
            label: "Go to demo study",
            to: "/invalid",
            isDemo: true,
            icon: "fa-solid fa-toggle-on"
        },
        {
            label: "Study design",
            icon: "fa-solid fa-folder-open",
            subMenu: [
                {
                    label: "Visits",
                    to: "/visits",
                    icon: "fa-regular fa-rectangle-list"
                },
                {
                    label: "Metadata",
                    to: "/metadata",
                    icon: "fa-solid fa-flask"
                },
                {
                    label: "Randomization",
                    to: "/randomization",
                    icon: "fa-solid fa-shuffle"
                },
                {
                    label: "Study documents",
                    to: "/studydocuments",
                    icon: "fa-regular fa-paste"
                },
                {
                    label: "Laboratories",
                    to: "/laboratories",
                    icon: "fa-solid fa-flask"
                },
                {
                    label: "eMails",
                    to: "/email-templates",
                    icon: "fa-solid fa-envelope"
                },
                {
                    label: "e-Consent",
                    to: "/econsent",
                    icon: "fa-regular fa-file-lines"
                },
            ]
        },
        {
            label: "Sites",
            to: "/sites",
            icon: "fa-solid fa-location-dot"
        },
        {
            label: "TMF",
            icon: "fa-solid fa-folder-open",
            subMenu: [
                {
                    label: "Template list",
                    to: "/tmftemplatelist",
                    icon: "fa-solid fa-table-cells-large"
                },
                {
                    label: "e-Mail template",
                    to: "/tmfemailtemplate",
                    icon: "fa-solid fa-envelope"
                },
            ]
        },
        {
            label: "Permissions",
            to: "/permissions",
            icon: "fa-solid fa-user-gear"
        },
        {
            label: "Users",
            to: "/users",
            icon: "fa-solid fa-user-plus"
        },
        {
            label: "System audit trail",
            to: "/systemaudittrail",
            icon: "fa-solid fa-clock-rotate-left"
        },
    ],
    superadmin: [
        {
            label: "Add system admin",
            to: "/add-system-admin",
            icon: "fa-solid fa-house"
        }
    ],
    systemadmin: [
        {
            label: "Tenants",
            to: "/tenants",
            icon: "fa-solid fa-house"
        },
        {
            label: "Users",
            to: "/tenant-and-system-admins",
            icon: "fa-solid fa-user-plus"
        },
        {
            label: "Settings",
            to: "/settings",
            icon: "fa-solid fa-gear"
        }
    ]
};

export default menuItems;