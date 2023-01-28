import PickMembers from "./PickMembers";
import KeysOfType from "./KeysOfType";

type PickMembersNotOfType<Interface, Filter> = PickMembers<
    Interface,
    Exclude<keyof Interface, KeysOfType<Interface, Filter>>
>;

export default PickMembersNotOfType;

export type PickNonVoidMembers<Interface> = PickMembersNotOfType<
    Interface,
    void
>;
