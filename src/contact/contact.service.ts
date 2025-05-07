import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Contact } from '@prisma/client';
import { CreateContactDto } from './contactdto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Récupérer tous les contacts
  async findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany(); 
  }

  // 🔹 Récupérer un contact spécifique par ID
  async findOne(id: number): Promise<Contact | null> {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  // 🔹 Créer un contact (sans user_id)
  async create(data: CreateContactDto): Promise<Contact> {
    return this.prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        subject: data.subject,
        content: data.content,
        // ✅ Supprimé user: { connect: ... }
      },
    });
  }
}
