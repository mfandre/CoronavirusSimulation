import { Person } from 'src/app/models/person';

export interface InfectionBehavior{
    infect(person1:Person,person2:Person);

    updateSymptoms(person1:Person);
}
  