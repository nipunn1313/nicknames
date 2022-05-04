import type { NextPage } from 'next'
import React, { useState, FormEvent } from 'react';
import { useMutation, useQuery } from "../convex/_generated";
import { PersonRow } from "../convex/getPeople";

const Home: NextPage = () => {
  const people = useQuery("getPeople");
  const addPerson = useMutation("addPerson");

  const handleAddPerson = (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      person: {value: string};
    };

    addPerson(target.person.value);
    target.person.value = '';
  };

  const peopleDom = people === undefined ? (
    <div>Loading people...</div>
  ) : (
    people.map((n, i)  => {
      return <Person key={i} person={n}/>
    })
  );

  return (
    <>
      <form onSubmit={handleAddPerson}>
        <label>Add person</label>
        <input type="text" name="person" />
        <input type="submit" value="Submit" />
      </form>

      {peopleDom}
    </>
  )
}

type PersonProps = {
  person: PersonRow;
}

const Person = (props: PersonProps) => {
  const addNickname = useMutation("addNickname");
  const nicknames = useQuery("getNicknamesForPerson", props.person._id);

  const handleAddNickname = (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      nickname: {value: string};
    };

    addNickname(props.person._id, target.nickname.value);
    target.nickname.value = '';
  };

  const nicknamesDom = nicknames === undefined ? (
    <div>Loading nicknames for {props.person.name}...</div>
  ) : (
    nicknames.map((n, i) => {
      return <div key={i}>{n.nickname}</div>
    })
  );

  return (
    <>
      <div>{props.person.name}</div>
      <form onSubmit={handleAddNickname}>
        <label>Add nickname for {props.person.name}: </label>
        <input type="text" name="nickname" placeholder="Get creative…" />
        <input type="submit" value="Submit" />
      </form>
      {nicknamesDom}
    </>
  )
}

export default Home
