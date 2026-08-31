package com.sis.service.mapper;

import com.sis.domain.Invoices;
import com.sis.domain.Student;
import com.sis.service.dto.InvoicesDTO;
import com.sis.service.dto.StudentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Invoices} and its DTO {@link InvoicesDTO}.
 */
@Mapper(componentModel = "spring")
public interface InvoicesMapper extends EntityMapper<InvoicesDTO, Invoices> {
    @Mapping(target = "student", source = "student", qualifiedByName = "studentId")
    InvoicesDTO toDto(Invoices s);

    @Named("studentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentDTO toDtoStudentId(Student student);
}
