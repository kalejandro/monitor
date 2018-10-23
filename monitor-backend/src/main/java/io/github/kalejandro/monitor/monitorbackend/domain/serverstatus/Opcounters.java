package io.github.kalejandro.monitor.monitorbackend.domain.serverstatus;

public class Opcounters {
  private long insert;
  private long query;
  private long update;
  private long delete;
  private long getmore;
  private long command;

  public Opcounters(long insert, long query, long update, long delete, long getmore, long command) {
    this.insert = insert;
    this.query = query;
    this.update = update;
    this.delete = delete;
    this.getmore = getmore;
    this.command = command;
  }

  public long getInsert() {
    return insert;
  }

  public long getQuery() {
    return query;
  }

  public long getUpdate() {
    return update;
  }

  public long getDelete() {
    return delete;
  }

  public long getGetmore() {
    return getmore;
  }

  public long getCommand() {
    return command;
  }
}
