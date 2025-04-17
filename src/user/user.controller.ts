import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/dto/user.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  // ✅ Récupérer tous les utilisateurs
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // ✅ Récupérer un utilisateur par ID
  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.findById(userId);
  }

  // ✅ Mettre à jour les infos générales d’un utilisateur
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.userService.UpdateUser({ ...dto, id: userId });
  }

  // ✅ Mettre à jour uniquement le statut d’un utilisateur
  @Patch(':id/status')
  async updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const validStatuses = ['active', 'inactive', 'deleted'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    return this.userService.updateStatus(
      userId,
      status as 'active' | 'inactive' | 'deleted',
    );
  }

  // ✅ Supprimer un utilisateur
  //@UseGuards(JwtGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.userService.deleteUser(userId);
  }
}
