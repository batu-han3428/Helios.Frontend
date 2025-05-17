#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:3300
EXPOSE 3300

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libglib2.0-0 \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libcups2 \
        libdbus-1-3 \
        libx11-6 \
        libx11-xcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxi6 \
        libxtst6 \
        libxrandr2 \
        libxss1 \
        libxrender1 \
        libcairo2 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libgdk-pixbuf2.0-0 \
        libasound2 \
        libgtk-3-0 \
        libatspi2.0-0 \
        libxkbcommon0 \
        libxslt1.1 \
        libgconf-2-4 \
        libgtk2.0-0 \
        libnspr4 \
        libsecret-1-0 \
        xvfb \
        libgbm1 \
        libglib2.0-bin \
        libglib2.0-dev \
        libwayland-client0 \
        libwayland-cursor0 \
    && rm -rf /var/lib/apt/lists/*


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src



COPY ["Helios.EDC/Helios.eCRF/Helios.eCRF.csproj", "Helios.EDC/Helios.eCRF/"]
COPY ["Helios.EDC/Helios.Common/Helios.Common.csproj", "Helios.EDC/Helios.Common/"]
COPY ["Helios.EDC/Helios.Core/Helios.Core.csproj", "Helios.EDC/Helios.Core/"]


RUN dotnet restore "./Helios.EDC/Helios.eCRF/./Helios.eCRF.csproj"
COPY . .


WORKDIR "/src/Helios.EDC/Helios.eCRF"
RUN dotnet build "./Helios.eCRF.csproj" -c $BUILD_CONFIGURATION -o /app/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Helios.eCRF.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Helios.eCRF.dll"]