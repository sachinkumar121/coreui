// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Capacitorpayterm",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "Capacitorpayterm",
            targets: ["PaytermPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "PaytermPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/PaytermPlugin"),
        .testTarget(
            name: "PaytermPluginTests",
            dependencies: ["PaytermPlugin"],
            path: "ios/Tests/PaytermPluginTests")
    ]
)