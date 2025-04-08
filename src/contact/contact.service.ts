import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Contact } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      include: {
        user: {
          select: { id: true }, // Sélectionner uniquement l'ID de l'utilisateur
        },
      },
    });
  }

  // 🔹 Récupérer un contact spécifique par ID
  async findOne(id: number): Promise<Contact | null> {
    return this.prisma.contact.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true }, // Sélectionner uniquement l'ID de l'utilisateur
        },
      },
    });
  }

  // 🔹 creation 
  async create(data: { 
    name: string; 
    email: string; 
    phone_number: string; 
    subject: string; 
    content: string; 
    user_id: number;
  }): Promise<Contact> {
    return this.prisma.contact.create({ data });
  }
}
