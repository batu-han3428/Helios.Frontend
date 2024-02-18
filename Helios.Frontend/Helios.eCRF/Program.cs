using Helios.eCRF.Extension;
using Helios.eCRF.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration; // allows both to access and to set up the config

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(option =>
{
    option.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration["JwtToken:Issuer"],
        ValidAudience = configuration["JwtToken:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtToken:SecurityKey"])),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", builder =>
    {
        builder.WithOrigins("https://localhost:44458", "https://localhost:7196", "https://localhost:3000") // Ýzin vermek istediðiniz kök domaini buraya ekleyin
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddControllers(options =>
{
    options.Filters.Add<TimeZoneHelper>();
});

builder.Services.DefaultConfigurationService(configuration);

var app = builder.Build();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        // Swagger UI'ýn kök dizinine yönlendirme
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseCors("MyPolicy");

app.MapControllers();

app.Run();
