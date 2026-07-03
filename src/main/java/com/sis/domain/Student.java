package com.sis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Student.
 */
@Entity
@Table(name = "student")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Student implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "lrn")
    private String lrn;

    @Size(max = 50)
    @Column(name = "first_name", length = 50)
    private String firstName;

    @Size(max = 50)
    @Column(name = "middle_name", length = 50)
    private String middleName;

    @Size(max = 50)
    @Column(name = "last_name", length = 50)
    private String lastName;

    @Size(max = 10)
    @Column(name = "ext_name", length = 10)
    private String extName;

    @Column(name = "birth_date")
    private Instant birthDate;

    @Size(max = 50)
    @Column(name = "birth_place", length = 50)
    private String birthPlace;

    @Size(max = 12)
    @Column(name = "contact_no", length = 12)
    private String contactNo;

    @Size(max = 200)
    @Column(name = "address_1", length = 200)
    private String address1;

    @Size(max = 200)
    @Column(name = "address_2", length = 200)
    private String address2;

    @Size(max = 50)
    @Column(name = "city", length = 50)
    private String city;

    @Size(max = 10)
    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Size(max = 50)
    @Column(name = "country", length = 50)
    private String country;

    @Size(max = 100)
    @Column(name = "nationality", length = 100)
    private String nationality;

    @Size(max = 50)
    @Column(name = "mother_tongue", length = 50)
    private String motherTongue;

    @Size(max = 100)
    @Column(name = "religion", length = 100)
    private String religion;

    @Size(max = 50)
    @Column(name = "fathers_last_name", length = 50)
    private String fathersLastName;

    @Size(max = 50)
    @Column(name = "fathers_middle_name", length = 50)
    private String fathersMiddleName;

    @Size(max = 50)
    @Column(name = "fathers_first_name", length = 50)
    private String fathersFirstName;

    @Size(max = 50)
    @Column(name = "fathers_ext_name", length = 50)
    private String fathersExtName;

    @Size(max = 50)
    @Column(name = "fathers_occupation", length = 50)
    private String fathersOccupation;

    @Size(max = 50)
    @Column(name = "fathers_contacts", length = 50)
    private String fathersContacts;

    @Size(max = 50)
    @Column(name = "mothers_last_name", length = 50)
    private String mothersLastName;

    @Size(max = 50)
    @Column(name = "mothers_middle_name", length = 50)
    private String mothersMiddleName;

    @Size(max = 50)
    @Column(name = "mothers_first_name", length = 50)
    private String mothersFirstName;

    @Size(max = 50)
    @Column(name = "mothers_occupation", length = 50)
    private String mothersOccupation;

    @Size(max = 50)
    @Column(name = "mothers_contacts", length = 50)
    private String mothersContacts;

    @Size(max = 50)
    @Column(name = "guardian_full_name", length = 50)
    private String guardianFullName;

    @Size(max = 50)
    @Column(name = "guardian_contacts", length = 50)
    private String guardianContacts;

    @Size(max = 50)
    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "created_date")
    private Instant createdDate;

    @Size(max = 50)
    @Column(name = "last_modified_by", length = 50)
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private Instant lastModifiedDate;

    @JsonIgnoreProperties(value = { "instructor", "student", "course" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private AppConfig gender;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "terms", "year", "instructor", "student" }, allowSetters = true)
    private Set<CourseSchedule> courseSchedules = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Student id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLrn() {
        return this.lrn;
    }

    public Student lrn(String lrn) {
        this.setLrn(lrn);
        return this;
    }

    public void setLrn(String lrn) {
        this.lrn = lrn;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Student firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return this.middleName;
    }

    public Student middleName(String middleName) {
        this.setMiddleName(middleName);
        return this;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Student lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getExtName() {
        return this.extName;
    }

    public Student extName(String extName) {
        this.setExtName(extName);
        return this;
    }

    public void setExtName(String extName) {
        this.extName = extName;
    }

    public Instant getBirthDate() {
        return this.birthDate;
    }

    public Student birthDate(Instant birthDate) {
        this.setBirthDate(birthDate);
        return this;
    }

    public void setBirthDate(Instant birthDate) {
        this.birthDate = birthDate;
    }

    public String getBirthPlace() {
        return this.birthPlace;
    }

    public Student birthPlace(String birthPlace) {
        this.setBirthPlace(birthPlace);
        return this;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public String getContactNo() {
        return this.contactNo;
    }

    public Student contactNo(String contactNo) {
        this.setContactNo(contactNo);
        return this;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getAddress1() {
        return this.address1;
    }

    public Student address1(String address1) {
        this.setAddress1(address1);
        return this;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return this.address2;
    }

    public Student address2(String address2) {
        this.setAddress2(address2);
        return this;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getCity() {
        return this.city;
    }

    public Student city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return this.zipCode;
    }

    public Student zipCode(String zipCode) {
        this.setZipCode(zipCode);
        return this;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return this.country;
    }

    public Student country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getNationality() {
        return this.nationality;
    }

    public Student nationality(String nationality) {
        this.setNationality(nationality);
        return this;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getMotherTongue() {
        return this.motherTongue;
    }

    public Student motherTongue(String motherTongue) {
        this.setMotherTongue(motherTongue);
        return this;
    }

    public void setMotherTongue(String motherTongue) {
        this.motherTongue = motherTongue;
    }

    public String getReligion() {
        return this.religion;
    }

    public Student religion(String religion) {
        this.setReligion(religion);
        return this;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getFathersLastName() {
        return this.fathersLastName;
    }

    public Student fathersLastName(String fathersLastName) {
        this.setFathersLastName(fathersLastName);
        return this;
    }

    public void setFathersLastName(String fathersLastName) {
        this.fathersLastName = fathersLastName;
    }

    public String getFathersMiddleName() {
        return this.fathersMiddleName;
    }

    public Student fathersMiddleName(String fathersMiddleName) {
        this.setFathersMiddleName(fathersMiddleName);
        return this;
    }

    public void setFathersMiddleName(String fathersMiddleName) {
        this.fathersMiddleName = fathersMiddleName;
    }

    public String getFathersFirstName() {
        return this.fathersFirstName;
    }

    public Student fathersFirstName(String fathersFirstName) {
        this.setFathersFirstName(fathersFirstName);
        return this;
    }

    public void setFathersFirstName(String fathersFirstName) {
        this.fathersFirstName = fathersFirstName;
    }

    public String getFathersExtName() {
        return this.fathersExtName;
    }

    public Student fathersExtName(String fathersExtName) {
        this.setFathersExtName(fathersExtName);
        return this;
    }

    public void setFathersExtName(String fathersExtName) {
        this.fathersExtName = fathersExtName;
    }

    public String getFathersOccupation() {
        return this.fathersOccupation;
    }

    public Student fathersOccupation(String fathersOccupation) {
        this.setFathersOccupation(fathersOccupation);
        return this;
    }

    public void setFathersOccupation(String fathersOccupation) {
        this.fathersOccupation = fathersOccupation;
    }

    public String getFathersContacts() {
        return this.fathersContacts;
    }

    public Student fathersContacts(String fathersContacts) {
        this.setFathersContacts(fathersContacts);
        return this;
    }

    public void setFathersContacts(String fathersContacts) {
        this.fathersContacts = fathersContacts;
    }

    public String getMothersLastName() {
        return this.mothersLastName;
    }

    public Student mothersLastName(String mothersLastName) {
        this.setMothersLastName(mothersLastName);
        return this;
    }

    public void setMothersLastName(String mothersLastName) {
        this.mothersLastName = mothersLastName;
    }

    public String getMothersMiddleName() {
        return this.mothersMiddleName;
    }

    public Student mothersMiddleName(String mothersMiddleName) {
        this.setMothersMiddleName(mothersMiddleName);
        return this;
    }

    public void setMothersMiddleName(String mothersMiddleName) {
        this.mothersMiddleName = mothersMiddleName;
    }

    public String getMothersFirstName() {
        return this.mothersFirstName;
    }

    public Student mothersFirstName(String mothersFirstName) {
        this.setMothersFirstName(mothersFirstName);
        return this;
    }

    public void setMothersFirstName(String mothersFirstName) {
        this.mothersFirstName = mothersFirstName;
    }

    public String getMothersOccupation() {
        return this.mothersOccupation;
    }

    public Student mothersOccupation(String mothersOccupation) {
        this.setMothersOccupation(mothersOccupation);
        return this;
    }

    public void setMothersOccupation(String mothersOccupation) {
        this.mothersOccupation = mothersOccupation;
    }

    public String getMothersContacts() {
        return this.mothersContacts;
    }

    public Student mothersContacts(String mothersContacts) {
        this.setMothersContacts(mothersContacts);
        return this;
    }

    public void setMothersContacts(String mothersContacts) {
        this.mothersContacts = mothersContacts;
    }

    public String getGuardianFullName() {
        return this.guardianFullName;
    }

    public Student guardianFullName(String guardianFullName) {
        this.setGuardianFullName(guardianFullName);
        return this;
    }

    public void setGuardianFullName(String guardianFullName) {
        this.guardianFullName = guardianFullName;
    }

    public String getGuardianContacts() {
        return this.guardianContacts;
    }

    public Student guardianContacts(String guardianContacts) {
        this.setGuardianContacts(guardianContacts);
        return this;
    }

    public void setGuardianContacts(String guardianContacts) {
        this.guardianContacts = guardianContacts;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Student createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Student createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return this.lastModifiedBy;
    }

    public Student lastModifiedBy(String lastModifiedBy) {
        this.setLastModifiedBy(lastModifiedBy);
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Instant getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Student lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public AppConfig getGender() {
        return this.gender;
    }

    public void setGender(AppConfig appConfig) {
        this.gender = appConfig;
    }

    public Student gender(AppConfig appConfig) {
        this.setGender(appConfig);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Student user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<CourseSchedule> getCourseSchedules() {
        return this.courseSchedules;
    }

    public void setCourseSchedules(Set<CourseSchedule> courseSchedules) {
        if (this.courseSchedules != null) {
            this.courseSchedules.forEach(i -> i.setStudent(null));
        }
        if (courseSchedules != null) {
            courseSchedules.forEach(i -> i.setStudent(this));
        }
        this.courseSchedules = courseSchedules;
    }

    public Student courseSchedules(Set<CourseSchedule> courseSchedules) {
        this.setCourseSchedules(courseSchedules);
        return this;
    }

    public Student addCourseSchedule(CourseSchedule courseSchedule) {
        this.courseSchedules.add(courseSchedule);
        courseSchedule.setStudent(this);
        return this;
    }

    public Student removeCourseSchedule(CourseSchedule courseSchedule) {
        this.courseSchedules.remove(courseSchedule);
        courseSchedule.setStudent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Student)) {
            return false;
        }
        return getId() != null && getId().equals(((Student) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Student{" +
            "id=" + getId() +
            ", lrn='" + getLrn() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", middleName='" + getMiddleName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", extName='" + getExtName() + "'" +
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
            "}";
    }
}
