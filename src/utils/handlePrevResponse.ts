export class PrevResponseManager<T = unknown> {
  private responses: T[] = [];

  /**
   * Initialize stored responses (replaces existing).
   */
  init(prevResponses: T[]): T[] {
    this.responses = Array.isArray(prevResponses) ? [...prevResponses] : [];
    return this.getAll();
  }

  /**
   * Add a response and return the updated list.
   */
  add(response: T): T[] {
    this.responses.push(response);
    return this.getAll();
  }

  /**
   * Remove all responses and return the cleared list.
   */
  clear(): T[] {
    this.responses = [];
    return this.getAll();
  }

  /**
   * Get a shallow copy of stored responses.
   */
  getAll(): T[] {
    return [...this.responses];
  }

  /**
   * Remove and return the last response.
   */
  removeLast(): T | undefined {
    return this.responses.pop();
  }

  /**
   * Keep only items matching predicate.
   */
  filter(predicate: (item: T) => boolean): void {
    this.responses = this.responses.filter(predicate);
  }
}

/**
 * Default singleton manager for easy use.
 */
const prevResponseManager = new PrevResponseManager<any>();

export default prevResponseManager;

export const initPrevResponse = <T = unknown>(prevResponses: T[]) =>
  (prevResponseManager as PrevResponseManager<T>).init(prevResponses);

export const addResponse = <T = unknown>(response: T) =>
  (prevResponseManager as PrevResponseManager<T>).add(response);

export const removeResponse = () => prevResponseManager.clear();

export const getPrevResponses = <T = unknown>() =>
  (prevResponseManager as PrevResponseManager<T>).getAll();
