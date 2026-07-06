package com.sis.repository;

import com.sis.domain.Student;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class StudentRepositoryWithBagRelationshipsImpl implements StudentRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String STUDENTS_PARAMETER = "students";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Student> fetchBagRelationships(Optional<Student> student) {
        return student.map(this::fetchCourseSchedules);
    }

    @Override
    public Page<Student> fetchBagRelationships(Page<Student> students) {
        return new PageImpl<>(fetchBagRelationships(students.getContent()), students.getPageable(), students.getTotalElements());
    }

    @Override
    public List<Student> fetchBagRelationships(List<Student> students) {
        return Optional.of(students).map(this::fetchCourseSchedules).orElse(List.of());
    }

    Student fetchCourseSchedules(Student result) {
        return entityManager
            .createQuery(
                "select student from Student student left join fetch student.courseSchedules where student.id = :id",
                Student.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Student> fetchCourseSchedules(List<Student> students) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, students.size()).forEach(index -> order.put(students.get(index).getId(), index));
        List<Student> result = entityManager
            .createQuery(
                "select student from Student student left join fetch student.courseSchedules where student in :students",
                Student.class
            )
            .setParameter(STUDENTS_PARAMETER, students)
            .getResultList();
        result.sort((o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
