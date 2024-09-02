const menuItems = {
    common: [
        //{
        //    label: "Home",
        //    to: "/home",
        //},
        //{
        //    label: "About",
        //    to: "/about",
        //},
    ],
    admin: [
        {
            label: "Studies",
            icon: "fa-solid fa-folder-tree",
            subMenu: [
                {
                    label: "Active",
                    to: "/studylist/false",
                    icon: "fa-solid fa-lock-open"
                },
                {
                    label: "Locked",
                    to: "/studylist/true",
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
            label: "Users",
            to: "/tenantusers",
            icon: "fa-solid fa-user-plus"
        }
    ],
    tenantstudy: [
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