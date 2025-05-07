import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Contact } from '@prisma/client';
import { ContactService } from './contact.service';
import { CreateContactDto } from './contactdto/contact.dto'; // Import du DTO

@Controller('api/v1/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // 🔹 Récupérer tous les contacts
  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  // 🔹 Récupérer un contact spécifique par ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact | null> {
    return this.contactService.findOne(Number(id));
  }

  // 🔹 Créer un nouveau contact
  @Post()
  async create(@Body() data: CreateContactDto): Promise<Contact> {  // Utiliser le DTO ici
    return this.contactService.create(data);
  }
}
