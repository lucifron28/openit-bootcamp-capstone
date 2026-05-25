FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /src

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

COPY *.csproj ./
RUN dotnet restore

COPY . ./

EXPOSE 8080

CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]
