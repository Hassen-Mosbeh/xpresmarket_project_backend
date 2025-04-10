import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { JwtService } from "@nestjs/jwt";



@Module({
     controllers: [ProductController],
     providers: [ProductService, PrismaService,JwtService]
})
export class ProductModule{}