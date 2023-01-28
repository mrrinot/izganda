import PickMembers from "./PickMembers";
import KeysWhereTypeCanBe from "./KeysWhereTypeCanBe";

type PickMembersWhereTypeCanBe<Interface, Filter> = PickMembers<
    Interface,
    KeysWhereTypeCanBe<Interface, Filter>
>;

export default PickMembersWhereTypeCanBe;
