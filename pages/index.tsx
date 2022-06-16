import type { NextPage } from 'next'
import React, { FormEvent, useState } from 'react';
import { useMutation, useQuery } from "../convex/_generated";
import { Member } from "../convex/getMembers";
import { GroupRow } from "../convex/getGroups";
import styles from "../styles/Home.module.css";
import internal from 'stream';
import { useAuth0 } from '@auth0/auth0-react';

const Home: NextPage = () => {
  // Local browser state for currently viewed group
  const [currentGroup, setCurrentGroup] = useState<GroupRow | undefined>(undefined);
  // Ability to add a new group to convex state
  const addGroup = useMutation("addGroup");
  const groups = useQuery("getGroups");

  if (currentGroup != undefined) {
    return (
      <>
        <button onClick={() => setCurrentGroup(undefined)}>Back to group list</button>
        <Group group={currentGroup}/>
      </>
    )
  }

  const groupsDom = groups === undefined ? (
    <div>Loading groups...</div>
  ) : (
    groups.map((g, i)  => {
      return (
        <div key={i}>
          <button onClick={() => setCurrentGroup(g)}>{g.name}</button>
        </div>
      )
    })
  );

  const handleAddGroup = (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      group: {value: string};
    };

    // Add new group state to convex
    addGroup(target.group.value)
    target.group.value = '';
  }

  return (
    <>
      <form onSubmit={handleAddGroup}>
        <label>Add a nickname group</label>
        <input type="text" name="group" />
        <input type="submit" value="Submit" />
      </form>

      {groupsDom}
    </>
  )
}

type GroupProps = {
  group: GroupRow,
}

const Group = (props: GroupProps) => {
  const { isLoading, isAuthenticated } = useAuth0();
  const people = useQuery("getMembers", props.group._id);
  const alreadyMember = useQuery("getMembers:alreadyMember", props.group._id);
  const addMember = useMutation("addMember");

  const peopleDom = people === undefined ? (
    <div>Loading people...</div>
  ) : (
    people.map((n, i)  => {
      return <Person key={i} member={n}/>
    })
  );

  let joinDom = null;
  if (!isLoading && isAuthenticated && (alreadyMember === false)) {
    joinDom = (
        <button onClick={() => addMember(props.group._id)}>Join Group</button>
    );
  }

  return (
    <>
      <div className={styles.groupName}>Group: {props.group.name}</div>
      {joinDom}
      {peopleDom}
    </>
  )
}

type PersonProps = {
  member: Member;
}

const Person = (props: PersonProps) => {
  const addNickname = useMutation("addNickname");
  const deleteNickname = useMutation("deleteNickname");
  const nicknames = useQuery("getMemberNicknames", props.member._id);

  const handleAddNickname = (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      nickname: {value: string};
    };

    addNickname(props.member._id, target.nickname.value);
    target.nickname.value = '';
  };

  const nicknamesDom = nicknames === undefined ? (
    <div>Loading nicknames for {props.member.name}...</div>
  ) : (
    nicknames.map((n, i) => {
      return (
        <div key={i}>
          {n.nickname}
          <button onClick={() => deleteNickname(n._id)}>Delete</button>
        </div>
      )
    })
  );

  return (
    <>
      <div className={styles.personName}>{props.member.name}</div>
      <form onSubmit={handleAddNickname}>
        <label>Add nickname for {props.member.name}: </label>
        <input type="text" name="nickname" placeholder="Get creative…" />
        <input type="submit" value="Submit" />
      </form>
      {nicknamesDom}
    </>
  )
}

export default Home
