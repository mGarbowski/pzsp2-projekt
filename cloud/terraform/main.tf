terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = "westeurope"
}

resource "azurerm_public_ip" "lab2_ip" {
  name                = "lab2-ip"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Dynamic"
}

resource "azurerm_virtual_network" "lab2_vnet" {
  name                = "lab2-vnet"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_network_security_group" "lab2_nsg" {
  name                = "lab2-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_network_security_rule" "ssh_rule" {
  name                        = "lab2-nsg-rule-ssh"
  priority                    = 1000
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.lab2_nsg.name
  resource_group_name         = azurerm_resource_group.rg.name
}

resource "azurerm_network_security_rule" "http_rule" {
  name                        = "pis-nsg-rule-http"
  priority                    = 1020
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "80"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.lab2_nsg.name
  resource_group_name         = azurerm_resource_group.rg.name
}

resource "azurerm_network_security_rule" "https_rule" {
  name                        = "pis-nsg-rule-https"
  priority                    = 1030
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.lab2_nsg.name
  resource_group_name         = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "lab2_subnet" {
  name                 = "lab2-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.lab2_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "frontend_nic" {
  name                = "frontend-nic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "frontend-ip-config"
    subnet_id                     = azurerm_subnet.lab2_subnet.id
    private_ip_address_allocation = "Static"
    private_ip_address            = var.frontend_private_ip
    public_ip_address_id          = azurerm_public_ip.lab2_ip.id
  }
}

resource "azurerm_network_interface" "backend_nic" {
  name                = "backend-nic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "backend-ip-config"
    subnet_id                     = azurerm_subnet.lab2_subnet.id
    private_ip_address_allocation = "Static"
    private_ip_address            = var.backend_private_ip
  }
}

resource "azurerm_linux_virtual_machine" "frontend_vm" {
  name                            = var.frontend_name
  location                        = azurerm_resource_group.rg.location
  resource_group_name             = azurerm_resource_group.rg.name
  size                            = "Standard_B1s"
  admin_username                  = "azureuser"
  network_interface_ids           = [azurerm_network_interface.frontend_nic.id]
  disable_password_authentication = true

  admin_ssh_key {
    username   = "azureuser"
    public_key = file(var.public_ssh_key_file)
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts"
    version   = "latest"
  }
}

resource "azurerm_linux_virtual_machine" "backend_vm" {
  name                            = var.backend_name
  location                        = azurerm_resource_group.rg.location
  resource_group_name             = azurerm_resource_group.rg.name
  size                            = "Standard_B1s"
  admin_username                  = "azureuser"
  network_interface_ids           = [azurerm_network_interface.backend_nic.id]
  disable_password_authentication = true

  admin_ssh_key {
    username   = "azureuser"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDTyNTnRMC1hxLhsA7JI4ZsLdZTBqFxkJSp/fmOIt1B+uYokjPljgoNNuqahzuiZ/26Uw4dcDwfcv6h0xeHp1nXtCuSYWdbVDDxYojQRWsVXYr72kex44Tg0WF4g7A1ub/lB+2Ik0e96SFYY/vlsqji6ie1c2pdtS6yuJBtgipDp3WEmgDArWw9PkvGzlZG58eW4DQSeNf/WsGsamIKpqzQm3jKpDvUfpeIxK2z+Qv1w5YyzAEM2InzFleUafx7PSZ9/rdJKRBRmts52c7FA8Z7LiGcZYtBL1S37NDdMwNFZDWJ3M8sDRSSblgndm9dkQdsQu3zqYn1TBrJK/pnPwIULMHIlpiyZo109tbQwzDRRvm9Ns/JRjpusEOE8aZEIlVSgipMs9H/mIS6oriAoolgUTVcmrenKAIZjQNjWM/syx3MEdmdv8SbSYnixV4ZT0wGkgmShQxsv1SfeAkSqNOiO3+OjjRkSyAM2tBFn9Xy8Ll9bxorUYOX7qxWheWfoTs= olek.drwal@gmail.com"
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts"
    version   = "latest"
  }
}

resource "azurerm_network_interface_security_group_association" "frontend_nsg_association" {
  network_interface_id      = azurerm_network_interface.frontend_nic.id
  network_security_group_id = azurerm_network_security_group.lab2_nsg.id
}

resource "azurerm_network_interface_security_group_association" "backend_nsg_association" {
  network_interface_id      = azurerm_network_interface.backend_nic.id
  network_security_group_id = azurerm_network_security_group.lab2_nsg.id
}