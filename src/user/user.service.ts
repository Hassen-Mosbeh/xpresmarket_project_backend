import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto,UpdateUserDto } from './dto/dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) throw new ConflictException('Email already exists');

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password, 10),
        profile: dto.profile,
        telephone: dto.telephone,
        ...(dto.username && { username: dto.username }),
        ...(dto.company_name && { company_name: dto.company_name }),
        ...(dto.company_adresse && { company_adresse: dto.company_adresse }),
        // ...(dto.company_tel && { company_tel: dto.company_tel }),
      },
    });

    const { password, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    console.log("🔍 findByEmail called with:", email);

    if (!email) {
      console.error("❌ Error: Email is undefined in findByEmail");
      throw new Error("Email is required");
    }


    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  
  async findById(id: number) {
    console.log("Received ID in findById:", id);
  
    if (!id || isNaN(id)) {
      throw new Error(`Invalid user ID: ${id}`);
    }
  
    return await this.prisma.user.findUnique({
      where: {
        id: id, 
      },
    });
  }

  async update(id:number, user:any) {
    return this.prisma.user.update({
      where: { id },
      data: user,
    }); 
  }

  async updateResetCode(email: string, resetCode: string) {
    return this.prisma.updateResetCode(email, resetCode);
  }

  async updatePassword(email: string, hashedPassword: string) {
    return this.prisma.updatePassword(email, hashedPassword);
  }

  async UpdateUser(dto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id: dto.id },
      data: {
        ...(dto.username && { username: dto.username }),
        ...(dto.telephone && { telephone: dto.telephone }),
        ...(dto.company_email && { company_email: dto.company_email }),
        ...(dto.company_name && { company_name: dto.company_name }),
        ...(dto.company_adresse && { company_adresse: dto.company_adresse }),
        ...(dto.company_tel && { company_tel: dto.company_tel }),
      },
    });
  }
}
