#-------------------------------------------------------------------------------
# Stage 1: Build the .NET application
#-------------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy the .csproj file(s) first to leverage Docker's build cache
# This means if only source code changes, npm install won't re-run

# Copy the solution file
COPY ["LernApp-Backend.sln", "./"]

# Copy each project file (.csproj) and its associated directory structure.
# The source path is relative to the build context (your 'backend' folder).
# The destination path maintains the exact structure within the container's WORKDIR (/src).

COPY ["LernApp.Models/LernApp.Models.csproj", "LernApp.Models/"]
COPY ["LernApp.Api/LernApp.Api.csproj", "LernApp.Api/"]

# Restore dependencies
RUN dotnet restore LernApp-Backend.sln

# Copy the rest of the application code
COPY . .

# Publish the application for release
# Use -c Release for production build
# Use -o /app/publish for the output directory within the container
RUN dotnet publish LernApp.Api/LernApp.Api.csproj -o /app/publish

#-------------------------------------------------------------------------------
# Stage 2: Create the final runtime image
#-------------------------------------------------------------------------------
# Use the ASP.NET runtime for web applications, or the base runtime for console apps
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
# For a console application, use: FROM mcr.microsoft.com/dotnet/runtime:9.0 AS final

WORKDIR /app

# Copy the published application from the build stage
COPY --from=build /app/publish .

# Expose port 80 for ASP.NET Core web applications
EXPOSE 8080

USER $APP_UID

# Define the entry point for the application
# For a web application:
ENTRYPOINT ["dotnet", "LernApp.Api.dll"]
