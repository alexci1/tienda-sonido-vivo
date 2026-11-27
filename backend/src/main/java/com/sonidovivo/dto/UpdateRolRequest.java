package com.sonidovivo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateRolRequest {
    @NotBlank(message = "El rol es obligatorio")
    private String rol;
}
