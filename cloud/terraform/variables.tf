variable "resource_group_name" {
  description = "Name of the resource group in azure"
  type        = string
  default     = "pzsp"
}

variable "frontend_name" {
  description = "Name of the frontend VM"
  type        = string
  default     = "frontend"
}

variable "backend_name" {
  description = "Name of the backend VM"
  type        = string
  default     = "backend"
}

variable "public_ssh_key_file" {
  description = "public key"
  type = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "frontend_private_ip" {
  description = "Private IP of the frontend VM"
  type        = string
  default     = "10.0.1.7"
}
variable "backend_private_ip" {
  description = "Private IP of the backend VM"
  type        = string
  default     = "10.0.1.8"
}