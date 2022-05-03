import type { NextPage } from 'next'
import React, { useState, FormEvent } from 'react';
import { useMutation, useQuery } from "../convex/_generated";

const Home: NextPage = () => {
  const people = useQuery("getPeople") ?? [];
  const addPerson = useMutation("addPerson");

  const handleAddPerson = (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      person: {value: string};
    };

    addPerson(target.person.value);
    target.person.value = '';
  };

  return (
    <>
      <form onSubmit={handleAddPerson}>
        <label>Add person</label>
        <input type="text" name="person" />
        <input type="submit" value="Submit" />
      </form>

      {
        people.map((n)  => {
          return <Person name={n.name}/>
        })
      }
    </>
  )
}

type PersonProps = {
  name: string;
}

const Person = (props: PersonProps) => {
  const [nicknames, setNicknames] = useState<Array<string>>([]);

  const handleAddNickname = (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      nickname: {value: string};
    };

    let ns = nicknames.slice();
    ns.push(target.nickname.value);
    target.nickname.value = '';
    setNicknames(ns);
  };

  return (
    <>
      <div>{props.name}</div>
      <form onSubmit={handleAddNickname}>
        <label>Add nickname for {props.name}: </label>
        <input type="text" name="nickname" placeholder="Get creative…" />
        <input type="submit" value="Submit" />
      </form>
      {
        nicknames.map((n, i) => {
          return <div key={i}>{n}</div>
        })
      }
    </>
  )
}

export default Home
