const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting KYARegistry Smart Contract Deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const KYARegistry = await hre.ethers.getContractFactory("KYARegistry");
  const kyaRegistry = await KYARegistry.deploy();

  await kyaRegistry.waitForDeployment();

  const contractAddress = await kyaRegistry.getAddress();
  console.log("KYARegistry contract successfully deployed to:", contractAddress);

  // Save contract address artifact for backend reference
  const deploymentData = {
    address: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };

  const deployPath = path.join(__dirname, "../deployment.json");
  fs.writeFileSync(deployPath, JSON.stringify(deploymentData, null, 2));
  console.log("Deployment artifact saved to:", deployPath);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
