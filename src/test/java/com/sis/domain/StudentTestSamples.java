package com.sis.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class StudentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Student getStudentSample1() {
        return new Student()
            .id(1L)
            .lrn("lrn1")
            .firstName("firstName1")
            .middleName("middleName1")
            .lastName("lastName1")
            .extName("extName1")
            .birthPlace("birthPlace1")
            .contactNo("contactNo1")
            .address1("address11")
            .address2("address21")
            .city("city1")
            .zipCode("zipCode1")
            .country("country1")
            .nationality("nationality1")
            .motherTongue("motherTongue1")
            .religion("religion1")
            .fathersLastName("fathersLastName1")
            .fathersMiddleName("fathersMiddleName1")
            .fathersFirstName("fathersFirstName1")
            .fathersExtName("fathersExtName1")
            .fathersOccupation("fathersOccupation1")
            .fathersContacts("fathersContacts1")
            .mothersLastName("mothersLastName1")
            .mothersMiddleName("mothersMiddleName1")
            .mothersFirstName("mothersFirstName1")
            .mothersOccupation("mothersOccupation1")
            .mothersContacts("mothersContacts1")
            .guardianFullName("guardianFullName1")
            .guardianContacts("guardianContacts1");
    }

    public static Student getStudentSample2() {
        return new Student()
            .id(2L)
            .lrn("lrn2")
            .firstName("firstName2")
            .middleName("middleName2")
            .lastName("lastName2")
            .extName("extName2")
            .birthPlace("birthPlace2")
            .contactNo("contactNo2")
            .address1("address12")
            .address2("address22")
            .city("city2")
            .zipCode("zipCode2")
            .country("country2")
            .nationality("nationality2")
            .motherTongue("motherTongue2")
            .religion("religion2")
            .fathersLastName("fathersLastName2")
            .fathersMiddleName("fathersMiddleName2")
            .fathersFirstName("fathersFirstName2")
            .fathersExtName("fathersExtName2")
            .fathersOccupation("fathersOccupation2")
            .fathersContacts("fathersContacts2")
            .mothersLastName("mothersLastName2")
            .mothersMiddleName("mothersMiddleName2")
            .mothersFirstName("mothersFirstName2")
            .mothersOccupation("mothersOccupation2")
            .mothersContacts("mothersContacts2")
            .guardianFullName("guardianFullName2")
            .guardianContacts("guardianContacts2");
    }

    public static Student getStudentRandomSampleGenerator() {
        return new Student()
            .id(longCount.incrementAndGet())
            .lrn(UUID.randomUUID().toString())
            .firstName(UUID.randomUUID().toString())
            .middleName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .extName(UUID.randomUUID().toString())
            .birthPlace(UUID.randomUUID().toString())
            .contactNo(UUID.randomUUID().toString())
            .address1(UUID.randomUUID().toString())
            .address2(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .zipCode(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .nationality(UUID.randomUUID().toString())
            .motherTongue(UUID.randomUUID().toString())
            .religion(UUID.randomUUID().toString())
            .fathersLastName(UUID.randomUUID().toString())
            .fathersMiddleName(UUID.randomUUID().toString())
            .fathersFirstName(UUID.randomUUID().toString())
            .fathersExtName(UUID.randomUUID().toString())
            .fathersOccupation(UUID.randomUUID().toString())
            .fathersContacts(UUID.randomUUID().toString())
            .mothersLastName(UUID.randomUUID().toString())
            .mothersMiddleName(UUID.randomUUID().toString())
            .mothersFirstName(UUID.randomUUID().toString())
            .mothersOccupation(UUID.randomUUID().toString())
            .mothersContacts(UUID.randomUUID().toString())
            .guardianFullName(UUID.randomUUID().toString())
            .guardianContacts(UUID.randomUUID().toString());
    }
}
