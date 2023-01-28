import PickMembers from "./PickMembers";
import KeysOfType from "./KeysOfType";

type PickMembersOfType<Interface, Filter> = PickMembers<
    Interface,
    KeysOfType<Interface, Filter>
>;

export default PickMembersOfType;

export type PickVoidMembers<Interface> = PickMembersOfType<Interface, void>;
