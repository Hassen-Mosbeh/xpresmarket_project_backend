import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { contact } from '@prisma/client';
import { ContactService } from './contact.service';
import { CreateContactDto } from './contactdto/contact.dto'; // Import du DTO

@Controller('api/v1/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // 🔹 Récupérer tous les contacts
  @Get()
  async findAll(): Promise<contact[]> {
    return this.contactService.findAll();
  }

  // 🔹 Récupérer un contact spécifique par ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<contact | null> {
    return this.contactService.findOne(Number(id));
  }


  @Post()
  async create(@Body() data: CreateContactDto): Promise<contact> { 
    return this.contactService.create(data);
  }
}
