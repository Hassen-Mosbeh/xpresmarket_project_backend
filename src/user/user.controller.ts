import { BadRequestException, Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/dto/user.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(":id")
async getUserProfile(@Param("id") id: string) {
  const userId = Number(id); // Convert to number safely
  if (isNaN(userId)) {
    throw new BadRequestException("Invalid user ID");
  }
  return this.userService.findById(userId);
}
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateProfile(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return await this.userService.UpdateUser({ ...dto, id: Number(id) });
  }
}
