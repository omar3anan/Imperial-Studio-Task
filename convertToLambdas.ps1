$Functions = @(
    "auth/register",
    "auth/login",
    "products/getProducts",
    "products/addProduct",
    "products/deleteProduct",
    "users/getProfile",
    "users/uploadProfilePicture",
    "users/getAllUsers",
    "users/getUserById",
    "users/createUser",
    "users/updateUser",
    "users/deleteUser",
    "wishlist/addToWishlist",
    "wishlist/getUserWishlist",
    "wishlist/removeFromWishlist"
)

New-Item -ItemType Directory -Path "lambda_packages" -Force

foreach ($Func in $Functions) {
    $FuncName = Split-Path $Func -Leaf
    $PackageDir = "lambda_packages/$FuncName"
    $ZipFile = "lambda_packages/$FuncName.zip"

    Write-Host "Packaging $FuncName..."

    New-Item -ItemType Directory -Path $PackageDir -Force
    Copy-Item "handlers/$Func.js" "$PackageDir/index.js"
    Copy-Item -Recurse "lib" "$PackageDir/" -Force
    Copy-Item -Recurse "models" "$PackageDir/" -Force
    Copy-Item -Recurse "node_modules" "$PackageDir/" -Force

    Compress-Archive -Path "$PackageDir/*" -DestinationPath $ZipFile -Force

    Remove-Item -Recurse -Force $PackageDir
}

Write-Host "Packaging complete. ZIP files are in lambda_packages/"