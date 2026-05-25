FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /app

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

COPY *.csproj ./
RUN dotnet restore

COPY . ./

EXPOSE 8080

CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]
