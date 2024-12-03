variable "resource_group_name" {
  description = "Name of the resource group in azure"
  type        = string
  default     = "pzsp"
}

variable "vnet_name" {
  description = "Name of the main virtual network in azure group"
  type        = string
  default     = "pzsp_net"
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

variable "user_1_email" {
  description = "Email of user 1"
  type        = string
  default     = "01178523@pw.edu.pl"
}
variable "user_2_email" {
  description = "Email of user 2"
  type        = string
  default     = "maksym.bienkowski.stud@pw.edu.pl"
}
variable "user_3_email" {
  description = "Email of user 3"
  type        = string
  default     = "michal.luszczek.stud@pw.edu.pl"
}
variable "user_4_email" {
  description = "Email of user 4"
  type        = string
  default     = "01178595@pw.edu.pl"
}