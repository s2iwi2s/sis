package com.sis.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.sis.domain.Student} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentDTO implements Serializable {

    private Long id;

    private String lrn;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String middleName;

    @Size(max = 50)
    private String lastName;

    @Size(max = 10)
    private String extName;

    private Instant enrollmentDate;

    private Instant birthDate;

    @Size(max = 50)
    private String birthPlace;

    @Size(max = 12)
    private String contactNo;

    @Size(max = 200)
    private String address1;

    @Size(max = 200)
    private String address2;

    @Size(max = 50)
    private String city;

    @Size(max = 10)
    private String zipCode;

    @Size(max = 50)
    private String country;

    @Size(max = 100)
    private String nationality;

    @Size(max = 50)
    private String motherTongue;

    @Size(max = 100)
    private String religion;

    @Size(max = 50)
    private String fathersLastName;

    @Size(max = 50)
    private String fathersMiddleName;

    @Size(max = 50)
    private String fathersFirstName;

    @Size(max = 50)
    private String fathersExtName;

    @Size(max = 50)
    private String fathersOccupation;

    @Size(max = 50)
    private String fathersContacts;

    @Size(max = 50)
    private String mothersLastName;

    @Size(max = 50)
    private String mothersMiddleName;

    @Size(max = 50)
    private String mothersFirstName;

    @Size(max = 50)
    private String mothersOccupation;

    @Size(max = 50)
    private String mothersContacts;

    @Size(max = 50)
    private String guardianFullName;

    @Size(max = 50)
    private String guardianContacts;

    @Size(max = 50)
    private String createdBy;

    private Instant createdDate;

    @Size(max = 50)
    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private AppConfigDTO gender;

    private AppConfigDTO gradelevel;

    private UserDTO user;

    private Set<CourseScheduleDTO> courseSchedules = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLrn() {
        return lrn;
    }

    public void setLrn(String lrn) {
        this.lrn = lrn;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getExtName() {
        return extName;
    }

    public void setExtName(String extName) {
        this.extName = extName;
    }

    public Instant getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(Instant enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public Instant getBirthDate() {
        return birthDate;
    }

    public Integer getAge() {
        if (this.birthDate == null) {
            return 0;
        }

        LocalDateTime birthdayLocalDateTime = LocalDateTime.ofInstant(this.birthDate, ZoneId.systemDefault());
        LocalDateTime today = LocalDateTime.now();
        return (int) ChronoUnit.YEARS.between(birthdayLocalDateTime, today);
    }

    public void setBirthDate(Instant birthDate) {
        this.birthDate = birthDate;
    }

    public String getBirthPlace() {
        return birthPlace;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getMotherTongue() {
        return motherTongue;
    }

    public void setMotherTongue(String motherTongue) {
        this.motherTongue = motherTongue;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getFathersLastName() {
        return fathersLastName;
    }

    public void setFathersLastName(String fathersLastName) {
        this.fathersLastName = fathersLastName;
    }

    public String getFathersMiddleName() {
        return fathersMiddleName;
    }

    public void setFathersMiddleName(String fathersMiddleName) {
        this.fathersMiddleName = fathersMiddleName;
    }

    public String getFathersFirstName() {
        return fathersFirstName;
    }

    public void setFathersFirstName(String fathersFirstName) {
        this.fathersFirstName = fathersFirstName;
    }

    public String getFathersExtName() {
        return fathersExtName;
    }

    public void setFathersExtName(String fathersExtName) {
        this.fathersExtName = fathersExtName;
    }

    public String getFathersOccupation() {
        return fathersOccupation;
    }

    public void setFathersOccupation(String fathersOccupation) {
        this.fathersOccupation = fathersOccupation;
    }

    public String getFathersContacts() {
        return fathersContacts;
    }

    public void setFathersContacts(String fathersContacts) {
        this.fathersContacts = fathersContacts;
    }

    public String getMothersLastName() {
        return mothersLastName;
    }

    public void setMothersLastName(String mothersLastName) {
        this.mothersLastName = mothersLastName;
    }

    public String getMothersMiddleName() {
        return mothersMiddleName;
    }

    public void setMothersMiddleName(String mothersMiddleName) {
        this.mothersMiddleName = mothersMiddleName;
    }

    public String getMothersFirstName() {
        return mothersFirstName;
    }

    public void setMothersFirstName(String mothersFirstName) {
        this.mothersFirstName = mothersFirstName;
    }

    public String getMothersOccupation() {
        return mothersOccupation;
    }

    public void setMothersOccupation(String mothersOccupation) {
        this.mothersOccupation = mothersOccupation;
    }

    public String getMothersContacts() {
        return mothersContacts;
    }

    public void setMothersContacts(String mothersContacts) {
        this.mothersContacts = mothersContacts;
    }

    public String getGuardianFullName() {
        return guardianFullName;
    }

    public void setGuardianFullName(String guardianFullName) {
        this.guardianFullName = guardianFullName;
    }

    public String getGuardianContacts() {
        return guardianContacts;
    }

    public void setGuardianContacts(String guardianContacts) {
        this.guardianContacts = guardianContacts;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Instant getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public AppConfigDTO getGender() {
        return gender;
    }

    public void setGender(AppConfigDTO gender) {
        this.gender = gender;
    }

    public AppConfigDTO getGradelevel() {
        return gradelevel;
    }

    public void setGradelevel(AppConfigDTO gradelevel) {
        this.gradelevel = gradelevel;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Set<CourseScheduleDTO> getCourseSchedules() {
        return courseSchedules;
    }

    public void setCourseSchedules(Set<CourseScheduleDTO> courseSchedules) {
        this.courseSchedules = courseSchedules;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentDTO studentDTO)) {
            return false;
        }

        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, studentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentDTO{" +
            "id=" + getId() +
            ", lrn='" + getLrn() + "'" +
            ", gradelevel='" + getGradelevel() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", middleName='" + getMiddleName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", extName='" + getExtName() + "'" +
            ", enrollmentDate='" + getEnrollmentDate() + "'" +
            ", birthDate='" + getBirthDate() + "'" +
            ", birthPlace='" + getBirthPlace() + "'" +
            ", contactNo='" + getContactNo() + "'" +
            ", address1='" + getAddress1() + "'" +
            ", address2='" + getAddress2() + "'" +
            ", city='" + getCity() + "'" +
            ", zipCode='" + getZipCode() + "'" +
            ", country='" + getCountry() + "'" +
            ", nationality='" + getNationality() + "'" +
            ", motherTongue='" + getMotherTongue() + "'" +
            ", religion='" + getReligion() + "'" +
            ", fathersLastName='" + getFathersLastName() + "'" +
            ", fathersMiddleName='" + getFathersMiddleName() + "'" +
            ", fathersFirstName='" + getFathersFirstName() + "'" +
            ", fathersExtName='" + getFathersExtName() + "'" +
            ", fathersOccupation='" + getFathersOccupation() + "'" +
            ", fathersContacts='" + getFathersContacts() + "'" +
            ", mothersLastName='" + getMothersLastName() + "'" +
            ", mothersMiddleName='" + getMothersMiddleName() + "'" +
            ", mothersFirstName='" + getMothersFirstName() + "'" +
            ", mothersOccupation='" + getMothersOccupation() + "'" +
            ", mothersContacts='" + getMothersContacts() + "'" +
            ", guardianFullName='" + getGuardianFullName() + "'" +
            ", guardianContacts='" + getGuardianContacts() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", gender=" + getGender() +
            ", user=" + getUser() +
            ", courseSchedules=" + getCourseSchedules() +
            "}";
    }
}
