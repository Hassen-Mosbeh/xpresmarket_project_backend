import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/dto/user.dto';
import { hash } from 'bcrypt';
import { Status } from './dto/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ✅ Création d'un utilisateur
  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        profile: dto.profile,
        telephone: dto.telephone,
        status: dto.status ?? Status.active,
        ...(dto.username && { username: dto.username }),
        ...(dto.company_name && { company_name: dto.company_name }),
        ...(dto.company_adresse && { company_adresse: dto.company_adresse }),
        ...(dto.company_tel && { company_tel: dto.company_tel }),
      },
    });

    const { password, ...result } = newUser;
    return result;
  }

  // ✅ Trouver un utilisateur par email
  async findByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // ✅ Trouver un utilisateur par ID
  async findById(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  // ✅ Récupérer tous les utilisateurs
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        username: true,
        profile: true,
        telephone: true,
        status: true,
        company_name: true,
        company_adresse: true,
        company_tel: true,
        company_email: true,
        createdAt: true,
      },
    });

    return users;
  }

  // ✅ Mise à jour générique
  async update(id: number, user: any) {
    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  // ✅ Mise à jour du reset code
  async updateResetCode(email: string, resetCode: string) {
    return this.prisma.updateResetCode(email, resetCode);
  }

  // ✅ Mise à jour du mot de passe
  async updatePassword(email: string, hashedPassword: string) {
    return this.prisma.updatePassword(email, hashedPassword);
  }

  // ✅ Mise à jour des infos utilisateur
  async UpdateUser(dto: UpdateUserDto & { id: number }) {
    const { id, ...data } = dto;

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.telephone && { telephone: data.telephone }),
        ...(data.company_email && { company_email: data.company_email }),
        ...(data.company_name && { company_name: data.company_name }),
        ...(data.company_adresse && { company_adresse: data.company_adresse }),
        ...(data.company_tel && { company_tel: data.company_tel }),
        ...(data.status && { status: data.status as Status }),
      },
    });
  }

  // ✅ Mise à jour spécifique du status (admin only) avec logique métier
  async updateStatus(id: number, status: Status | string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const currentStatus = user.status;

    // Vérifier que le nouveau statut est valide
    if (!Object.values(Status).includes(status as Status)) {
      throw new BadRequestException('Invalid status value');
    }

    // Logique métier
    if (currentStatus === Status.deleted) {
      throw new BadRequestException("Cannot modify a deleted user");
    }

    if (currentStatus === status) {
      throw new BadRequestException(`User is already ${status}`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { status: status as Status },
    });
  }
}
