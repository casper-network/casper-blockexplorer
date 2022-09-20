interface RpcListItem {
  id: number;
  url: string;
  isDead: boolean;
}

class NodeManager {
  private nodeAddresses: RpcListItem[] = [];

  constructor(listOfRpcs: string[]) {
    this.nodeAddresses = listOfRpcs.map((url, id) => ({
      id,
      url,
      isDead: false,
    }));
  }

  getActiveNode(): RpcListItem {
    const activeNode = this.nodeAddresses.find((n) => !n.isDead);

    if (!activeNode) {
      throw Error("All provided nodes are dead");
    }

    return activeNode;
  }

  setDeadNode(selectedId: number): void {
    this.nodeAddresses = this.nodeAddresses.map((item) =>
      item.id === selectedId ? { ...item, isDead: true } : item
    );
  }
}

if (!process.env.RPC_ENDPOINTS) {
  throw Error("Missing RPC_ENDPOINTS env variable");
}

export default new NodeManager(process.env.RPC_ENDPOINTS.split(","));
