import { rootReducer } from "./reducers"
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { LoginApi } from './services/Login'
import { StudyApi } from './services/Study'
import { SubjectApi } from './services/Subject'
import { SiteLaboratoriesApi } from './services/SiteLaboratories'
import { ContactUsApi } from './services/ContactUs'
import { PermissionsApi } from './services/Permissions'
import { UsersApi } from './services/Users'
import { TenantUsersApi } from './services/TenantUsers'
import { SSOApi } from './services/SSO/SSO_Api'
import { EmailTemplateApi } from './services/EmailTemplate'
import { SystemAdminApi } from './services/SystemAdmin/SystemAdmin'
import { TenantsApi } from './services/Tenants'
import { SystemUsersApi } from './services/SystemAdmin/Users/SystemUsers'
import { VisitApi } from './services/Visit'
import { ModuleApi } from "./services/Module"
import { setLocalStorage } from '../../src/helpers/local-storage/localStorageProcess';

const preloadedState = {
    rootReducer: {
        Login: setLocalStorage()
    }
};

export const store = configureStore({
    reducer: {
        rootReducer,
        preloadedState,
        [LoginApi.reducerPath]: LoginApi.reducer,
        [StudyApi.reducerPath]: StudyApi.reducer,
        [SubjectApi.reducerPath]: SubjectApi.reducer,
        [SiteLaboratoriesApi.reducerPath]: SiteLaboratoriesApi.reducer,
        [ContactUsApi.reducerPath]: ContactUsApi.reducer,
        [PermissionsApi.reducerPath]: PermissionsApi.reducer,
        [UsersApi.reducerPath]: UsersApi.reducer,
        [TenantUsersApi.reducerPath]: TenantUsersApi.reducer,
        [SSOApi.reducerPath]: SSOApi.reducer,
        [EmailTemplateApi.reducerPath]: EmailTemplateApi.reducer,
        [SystemAdminApi.reducerPath]: SystemAdminApi.reducer,
        [TenantsApi.reducerPath]: TenantsApi.reducer,
        [SystemUsersApi.reducerPath]: SystemUsersApi.reducer,
        [VisitApi.reducerPath]: VisitApi.reducer,
        [ModuleApi.reducerPath]: ModuleApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            LoginApi.middleware,
            StudyApi.middleware,
            SubjectApi.middleware,
            SiteLaboratoriesApi.middleware,
            ContactUsApi.middleware,
            PermissionsApi.middleware,
            UsersApi.middleware,
            TenantUsersApi.middleware,
            SSOApi.middleware,
            EmailTemplateApi.middleware,
            SystemAdminApi.middleware,
            TenantsApi.middleware,
            SystemUsersApi.middleware,
            VisitApi.middleware,
            ModuleApi.middleware
        )
})

setupListeners(store.dispatch);