FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /app

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"
ENV ASPNETCORE_URLS=http://+:8080

COPY SideKick.Api.csproj ./
RUN dotnet restore SideKick.Api.csproj

COPY . ./

EXPOSE 8080

CMD ["dotnet", "watch", "--project", "SideKick.Api.csproj", "run"]
